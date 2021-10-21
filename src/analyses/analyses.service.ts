import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import got from 'got';
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
        private readonly configService: ConfigService,
    ) {}

    async getAnalyses(
        mbrSeq: string,
        page: string,
    ): Promise<GetAnalysesOutput> {
        try {
            const { orderByColumn, orderByType } = this.parseOrderBy('latest');

            const analyses = await this.analyses
                .createQueryBuilder('an')
                .leftJoinAndSelect('an.refVideo', 'rv')
                .select()
                .where('an.mbr_seq = :id', { id: mbrSeq })
                .andWhere('an.an_deleted = false')
                .orderBy(orderByColumn, orderByType)
                .limit(PaginationInput.take)
                .offset(PaginationInput.skip(+page))
                .getMany();

            const totalResultsQueryResult = await this.analyses.manager.query(`
                SELECT COUNT(*)
                FROM analysis
                WHERE mbr_seq = ${mbrSeq}
                AND an_deleted = false
            `);

            const totalResults = +totalResultsQueryResult[0].count;
            const totalPages = Math.ceil(totalResults / PaginationInput.take);

            return { ok: true, totalResults, totalPages, analyses };
        } catch (error) {
            console.log(error.stack, error.message);

            return {
                ok: false,
                error: '분석 결과 목록을 불러오지 못했습니다.',
            };
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

            const analyses = await this.analyses
                .createQueryBuilder('an')
                .leftJoinAndSelect('an.refVideo', 'rv')
                .select()
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

            const totalResultsQueryResult = await this.analyses.manager.query(`
                SELECT COUNT(*)
                FROM analysis AS an
                JOIN ref_video AS rv
                  ON rv.rv_seq = an.rv_seq
                WHERE mbr_seq = ${mbrSeq}
                AND an_deleted = false
                AND (
                    rv.rv_source_title LIKE '%${query}%'
                    OR rv.rv_source_account_name LIKE '%${query}%'
                    OR rv.rv_song_name LIKE '%${query}%'
                    OR rv.rv_artist_name LIKE '%${query}%'
                )
            `);

            const totalResults = +totalResultsQueryResult[0].count;
            const totalPages = Math.ceil(totalResults / PaginationInput.take);

            return { ok: true, totalResults, totalPages, analyses };
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

            const simularityJson = await this.getSimularityJson(
                analysis.anSimularityFilename,
            );

            return { ok: true, analysis: analysis, simularityJson };
        } catch (error) {
            console.log(error.stack, error.message);
            return {
                ok: false,
                error: '분석 결과를 불러오지 못했습니다.',
            };
        }
    }

    private async getSimularityJson(simularityFilename: string) {
        try {
            const simularityFullPath = `${this.configService.get(
                'AWS_AN_JSON_BUCKET_ENDPOINT',
            )}/${simularityFilename}`;
            const simularityJson = await got.get(simularityFullPath).json();
            return simularityJson;
        } catch {
            return {};
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
            const newAnalysis = await this.analyses
                .createQueryBuilder('an')
                .select()
                .leftJoin('an.member', 'mbr')
                .where('an.anSeq = :anSeq', { anSeq: analysisInput.anSeq })
                .andWhere('mbr.mbrSeq = :mbrSeq', { mbrSeq })
                .getOne();

            if (!newAnalysis) {
                return { ok: false, error: 'Cannot find analysis' };
            }

            newAnalysis.anSimularityFilename =
                analysisInput.anSimularityFilename;
            newAnalysis.anUserVideoMotionDataFilename =
                analysisInput.anUserVideoMotionDataFilename;
            newAnalysis.anScore = analysisInput.anScore;
            newAnalysis.anGradeCode = analysisInput.anGradeCode;
            newAnalysis.anStatusCode = analysisInput.anStatusCode;

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
        jwt: string,
    ) {
        try {
            const { rvSeq, anUserVideoFilename, mirrorEffect } =
                createAnalysisRequestInput;
            const newAnalysis = await this.analyses.create({
                rvSeq,
                anUserVideoFilename,
            });

            const { refVideo, ok, error } =
                await this.refVideos.findRefVideoById(rvSeq);
            if (!ok) {
                return { ok, error };
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
                jwt,
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

    private async registerAnalysisInQueue(
        analysis: Analysis,
        refVideo: RefVideo,
        jwt: string,
        mirrorEffect: boolean,
    ): Promise<boolean> {
        try {
            const newUserVideoFileName = await this.awsService.convertWebmToMp4(
                analysis.anUserVideoFilename,
                mirrorEffect,
            );

            analysis.anUserVideoFilename = newUserVideoFileName;
            await this.analyses.save(analysis);

            const isRequestSuccessful =
                await this.awsService.callUserVideoAnalystApi(
                    analysis,
                    refVideo,
                    jwt,
                );

            return isRequestSuccessful;
        } catch (error) {
            console.log(error.stack, error.message);
            return false;
        }
    }
}
