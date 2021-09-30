import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { PaginationInput } from 'src/common/dtos/pagination.dto';
import { Member } from 'src/members/entities/members.entity';
import { RefVideo } from 'src/ref-videos/entities/ref-video.entity';
import { RefVideosService } from 'src/ref-videos/ref-videos.service';
import { Brackets, DeepPartial, Repository } from 'typeorm';
import {
    CreateAnalysisRequestInput,
    RegisterAnalysisInQueueInput,
} from './dtos/create-analysis-request.dto';
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
                    'an.anUserVideoURL',
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
                    'an.anUserVideoURL',
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
            const newAnalysis = await this.buildAnalysis(analysisInput, mbrSeq);
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
            const { anUserVideoURL } = createAnalysisRequestInput;
            const newAnalysis: Analysis = await this.buildAnalysis(
                createAnalysisRequestInput,
                member.mbrSeq,
            );
            const savedAnalysis: Analysis = await this.analyses.save(
                newAnalysis,
            );

            await this.registerAnalysisInQueue({
                anSeq: savedAnalysis.anSeq,
                anUserVideoURL,
                rvSeq: savedAnalysis.rvSeq,
            });

            return { ok: true, savedAnalysis };
        } catch (error) {
            console.log(error.stack, error.message);
            return { ok: false, error: '분석 요청에 실패했습니다.' };
        }
    }

    private async registerAnalysisInQueue(
        registerAnalysisInQueueInput: RegisterAnalysisInQueueInput,
    ) {
        const { anSeq, rvSeq, anUserVideoURL } = registerAnalysisInQueueInput;
        const { ok, refVideo } = await this.refVideos.findRefVideoById(rvSeq);
        if (!ok) {
            throw new Error(`Cannot Find refVideo with rvSeq(${rvSeq})`);
        }
        const refVideoUrl = refVideo.rvUrl;

        await this.callAutoMotionWorkerApi(anSeq, anUserVideoURL, refVideoUrl);
        return { ok: true };
    }

    private async callAutoMotionWorkerApi(
        anSeq: string,
        userVideoUrl: string,
        refVideoUrl: string,
    ) {
        /**
         * TODO
         * 인공지능 돌리는 EC2에 분석 요청
         */
        return true;
    }

    private async buildAnalysis(
        analysis: DeepPartial<Analysis>,
        mbrSeq: string,
    ): Promise<Analysis> {
        const newAnalysis = this.analyses.create(analysis);

        newAnalysis.member = new Member();
        newAnalysis.member.mbrSeq = mbrSeq;

        newAnalysis.refVideo = new RefVideo();
        newAnalysis.refVideo.rvSeq = analysis.rvSeq;

        newAnalysis.creatorSeq = mbrSeq;
        newAnalysis.updaterSeq = mbrSeq;

        return newAnalysis;
    }
}
