import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AwsService } from 'src/aws/aws.service';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { PaginationInput } from 'src/common/dtos/pagination.dto';
import { AnalysisStatusCode } from 'src/common/enums/code.enum';
import { Member } from 'src/members/entities/members.entity';
import { RefVideo } from 'src/ref-videos/entities/ref-video.entity';

import { RefVideosService } from 'src/ref-videos/ref-videos.service';
import { Brackets, Repository } from 'typeorm';
import { CreateAnalysisRequestInput } from './dtos/create-analysis-request.dto';
import {
    CreateAnalysisResultInput,
    CreateAnalysisResultOutput,
} from './dtos/create-analysis-result.dto';
import {
    GetAnalysesOutput,
    GetAnalysisBySeqOutput,
} from './dtos/get-analyses.dto';
import { Analysis } from './entities/analyses.entity';

interface ParceOrderByOutput {
    orderByColumn: string;
    orderByType: 'DESC' | 'ASC';
}

@Injectable()
export class AnalysesService {
    constructor(
        @InjectRepository(Analysis)
        private readonly analyses: Repository<Analysis>,
        private readonly refVideos: RefVideosService,
        private readonly awsService: AwsService,
    ) {}

    async getAnalyses(
        mbrSeq: string,
        page: string,
    ): Promise<GetAnalysesOutput> {
        try {
            const analyses = await this.analyses
                .createQueryBuilder('an')
                .leftJoinAndSelect('an.refVideo', 'rv')
                .select([
                    'an.createdDate',
                    'an.anSeq',
                    'an.anScore',
                    'an.anScore',
                    'an.anGradeCode',
                    'an.anUserVideoFilename',
                    'rv.rvSeq',
                    'rv.rvSource',
                    'rv.rvSourceTitle',
                    'rv.rvSourceAccountName',
                    'rv.rvUrl',
                    'rv.rvDifficulty',
                    'rv.rvSongName',
                    'rv.rvArtistName',
                ])
                .where('an.mbr_seq = :id', { id: mbrSeq })
                .andWhere('an.an_deleted = false')
                .limit(PaginationInput.take)
                .offset(PaginationInput.skip(+page))
                .getMany();
            return { ok: true, analyses: analyses };
        } catch (error) {
            console.log(error.stack, error.message);

            return {
                ok: false,
                error: '분석 결과 목록을 불러오지 못했습니다.',
            };
        }
    }

    private parseOrderBy(orderBy: string): ParceOrderByOutput {
        switch (orderBy) {
            case 'latest':
                return { orderByColumn: 'an.createdDate', orderByType: 'DESC' };
            case 'oldest':
                return { orderByColumn: 'an.createdDate', orderByType: 'ASC' };
            case 'highest-score':
                return { orderByColumn: 'an.anScore', orderByType: 'DESC' };
            case 'lowest-score':
                return { orderByColumn: 'an.anScore', orderByType: 'ASC' };
            default:
                return { orderByColumn: 'an.createdDate', orderByType: 'DESC' };
        }
    }

    async searchAnalyses(
        mbrSeq: string,
        query: string,
        orderBy: string,
        page: string,
    ): Promise<GetAnalysesOutput> {
        try {
            query = query ?? '';
            orderBy = orderBy ?? '';

            const { orderByColumn, orderByType } = this.parseOrderBy(orderBy);

            const analysis = await this.analyses
                .createQueryBuilder('an')
                .leftJoinAndSelect('an.refVideo', 'rv')
                .select([
                    'an.anSeq',
                    'an.anScore',
                    'an.anGradeCode',
                    'an.anUserVideoFilename',
                    'rv.rvSeq',
                    'rv.rvSource',
                    'rv.rvSourceTitle',
                    'rv.rvSourceAccountName',
                    'rv.rvUrl',
                    'rv.rvDifficulty',
                    'rv.rvSongName',
                    'rv.rvArtistName',
                ])
                .where('an.mbr_seq = :id', { id: mbrSeq })
                .andWhere('an.an_deleted = false')
                .andWhere(
                    new Brackets((qb) => {
                        qb.where(`rv.rvSourceTitle like :q`, {
                            q: `%${query}%`,
                        })
                            .orWhere(`rv.rvSourceAccountName like :q`, {
                                q: `%${query}%`,
                            })
                            .orWhere(`rv.rvSongName like :q`, {
                                q: `%${query}%`,
                            })
                            .orWhere(`rv.rvArtistName like :q`, {
                                q: `%${query}%`,
                            });
                    }),
                )
                .orderBy(orderByColumn, orderByType)
                .limit(PaginationInput.take)
                .offset(PaginationInput.skip(+page))
                .getMany();
            return { ok: true, analyses: analysis };
        } catch (error) {
            console.log(error.stack, error.message);

            return {
                ok: false,
                error: '분석 결과 목록을 불러오지 못했습니다.',
            };
        }
    }

    async getAnalysisBySeq(
        mbrSeq: string,
        anSeq: string,
    ): Promise<GetAnalysisBySeqOutput> {
        try {
            const analysis = await this.analyses
                .createQueryBuilder('an')
                .leftJoinAndSelect('an.refVideo', 'rv')
                .where('an.mbr_seq = :mbrSeq', { mbrSeq })
                .andWhere('an.an_seq = :anSeq', { anSeq })
                .andWhere('an.an_deleted = false')
                .getOne();

            return { ok: true, analysis: analysis };
        } catch (error) {
            console.log(error.stack, error.message);
            return {
                ok: false,
                error: '분석 결과를 불러오지 못했습니다.',
            };
        }
    }

    async deleteAnalysis(mbrSeq: string, anSeq: string): Promise<CoreOutput> {
        try {
            const { ok, analysis, error } = await this.getAnalysisBySeq(
                mbrSeq,
                anSeq,
            );

            if (!ok) {
                return { ok, error };
            }
            analysis.anDeleted = true;

            await this.analyses.save(analysis);

            return { ok: true };
        } catch (error) {
            console.log(error.stack, error.message);
            return { ok: false, error: '분석 결과를 삭제하지 못했습니다.' };
        }
    }

    async purgeAnalysis(mbrSeq: string, anSeq: string): Promise<CoreOutput> {
        try {
            const { ok, error } = await this.getAnalysisBySeq(mbrSeq, anSeq);
            if (!ok) {
                return { ok, error };
            }

            await this.analyses.delete({ anSeq });

            return { ok: true };
        } catch (error) {
            console.log(error.stack, error.message);
            return { ok: false, error: '분석 결과를 삭제하지 못했습니다.' };
        }
    }

    async createAnalysisResult(
        mbrSeq: string,
        analysisInput: CreateAnalysisResultInput,
    ): Promise<CreateAnalysisResultOutput> {
        try {
            const newAnalysis = await this.analyses.findOne({
                anSeq: analysisInput.anSeq,
            });

            if (!newAnalysis) {
                throw new Error('Cannot get analysis');
            }

            newAnalysis.anSimularityFilename =
                analysisInput.anSimularityFilename;
            newAnalysis.anUserVideoMotionDataFilename =
                analysisInput.anUserVideoMotionDataFilename;
            newAnalysis.anScore = analysisInput.anScore;
            newAnalysis.anGradeCode = analysisInput.anGradeCode;

            newAnalysis.updaterSeq = mbrSeq;

            const savedAnalysis = await this.analyses.save(newAnalysis);

            return { ok: true, analysis: savedAnalysis };
        } catch (error) {
            console.log(error.stack, error.message);
            return {
                ok: false,
                error: '분석 결과를 등록하지 못했습니다.',
            };
        }
    }

    async createAnalysisRequest(
        member: Member,
        createAnalysisRequestInput: CreateAnalysisRequestInput,
    ) {
        try {
            const { rvSeq, anUserVideoFilename, mirrorEffect } =
                createAnalysisRequestInput;
            const newAnalysis = await this.analyses.create({
                rvSeq,
                anUserVideoFilename,
            });

            const { refVideo, ok } = await this.refVideos.findRefVideoById(
                rvSeq,
            );
            if (!ok) {
                throw new Error('Cannot find ref video');
            }
            newAnalysis.refVideo = refVideo;
            newAnalysis.anUserVideoDuration = refVideo.rvDuration;

            newAnalysis.anStatusCode = AnalysisStatusCode.START;

            newAnalysis.member = member;
            newAnalysis.creatorSeq = member.mbrSeq;
            newAnalysis.updaterSeq = member.mbrSeq;

            const savedAnalysis: Analysis = await this.analyses.save(
                newAnalysis,
            );

            const response = await this.registerAnalysisInQueue(
                savedAnalysis,
                refVideo,
                mirrorEffect,
            );

            if (response) {
                newAnalysis.anStatusCode = AnalysisStatusCode.PROCESSING;
                await this.analyses.save(newAnalysis);
            } else {
                newAnalysis.anStatusCode = AnalysisStatusCode.FAIL;
                await this.analyses.save(newAnalysis);
                return { ok: false, error: '분석 요청에 실패했습니다.' };
            }

            return { ok: true, savedAnalysis };
        } catch (error) {
            console.log(error.stack, error.message);
            return { ok: false, error: '분석 요청에 실패했습니다.' };
        }
    }

    private async registerAnalysisInQueue(
        analysis: Analysis,
        refVideo: RefVideo,
        mirrorEffect: boolean,
    ): Promise<boolean> {
        try {
            const newUserVideoFileName = await this.awsService.convertWebmToMp4(
                analysis.anUserVideoFilename,
                mirrorEffect,
            );

            analysis.anUserVideoFilename = newUserVideoFileName;
            this.analyses.save(analysis);

            await this.awsService.callAutoMotionWorkerApi(analysis, refVideo);
            return true;
        } catch (error) {
            console.log(error.stack);
            return false;
        }
    }
}
