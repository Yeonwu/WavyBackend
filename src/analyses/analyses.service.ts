import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { PaginationInput } from 'src/common/dtos/pagination.dto';
import { Member } from 'src/members/entities/members.entity';
import { RefVideo } from 'src/ref-videos/entities/ref-video.entity';
import { Brackets, Repository } from 'typeorm';
import { SearchAnalysesOrderBy } from './analyses.controller';
import { CreateAnalysisResultInput } from './dtos/create-analysis-result.dto';
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
        private readonly configService: ConfigService,
    ) {}

    async getAnalyses(mbrSeq: string, page: string) {
        try {
            const analyses = await this.analyses
                .createQueryBuilder('an')
                .leftJoinAndSelect('an.refVideo', 'rv')
                .select([
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
            console.log(`From AnalysesService.getAnalyses: ${error.message}`);
            console.log(`Args: (${mbrSeq}), (mbrSeq: string)`);

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
    ) {
        try {
            page = page ?? '1';
            query = query ?? '';
            orderBy = orderBy ?? '';

            const { orderByColumn, orderByType } = this.parseOrderBy(orderBy);

            const analysis = await this.analyses
                .createQueryBuilder('an')
                .leftJoinAndSelect('an.refVideo', 'rv')
                .select([
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
            console.log(`From AnalysesService.getAnalyses: ${error.message}`);
            console.log(
                `Args: (${mbrSeq}, ${query}, ${orderBy}), (mbrSeq: ${typeof mbrSeq}, query: ${typeof query}, orderBy: ${typeof orderBy})`,
            );

            return {
                ok: false,
                error: '분석 결과 목록을 불러오지 못했습니다.',
            };
        }
    }

    async getAnalysisBySeq(mbrSeq: string, anSeq: string) {
        try {
            const analysis = await this.analyses
                .createQueryBuilder('an')
                .leftJoinAndSelect('an.refVideo', 'rv')
                .where('an.mbr_seq = :mbrSeq', { mbrSeq })
                .andWhere('an.an_seq = :anSeq', { anSeq })
                .andWhere('an.an_deleted = false')
                .getOne();

            return { ok: true, response: { analysis } };
        } catch (error) {
            console.log(
                `From AnalysesService.getAnalysisBySeq: ${error.message}`,
            );
            console.log(
                `Args: (${mbrSeq}, ${anSeq}), (mbrSeq: ${typeof mbrSeq}, anSeq: ${typeof anSeq})`,
            );
            return {
                ok: false,
                error: '분석 결과를 불러오지 못했습니다.',
            };
        }
    }

    async deleteAnalysis(mbrSeq: string, anSeq: string) {
        try {
            const { ok, response, error } = await this.getAnalysisBySeq(
                mbrSeq,
                anSeq,
            );

            if (!ok) {
                return { ok, error };
            }

            const analysis = response.analysis;
            analysis.anDeleted = true;

            await this.analyses.save(analysis);

            return { ok: true };
        } catch (error) {
            console.log(error.message);
            return { ok: false, error: '분석 결과를 삭제하지 못했습니다.' };
        }
    }

    async purgeAnalysis(mbrSeq: string, anSeq: string) {
        try {
            const { ok, error } = await this.getAnalysisBySeq(mbrSeq, anSeq);
            if (!ok) {
                return { ok, error };
            }

            await this.analyses.delete({ anSeq });

            return { ok: true };
        } catch (error) {
            console.log(error.message);
            return { ok: false, error: '분석 결과를 삭제하지 못했습니다.' };
        }
    }

    async createAnalysisResult(
        mbrSeq: string,
        analysisInput: CreateAnalysisResultInput,
    ) {
        try {
            const newAnalysis = await this.buildAnalysis(analysisInput, mbrSeq);
            const savedAnalysis = await this.analyses.save(newAnalysis);

            return { ok: true, response: { analysis: savedAnalysis } };
        } catch (error) {
            console.log(
                `Args: (${mbrSeq}, ${analysisInput}), (mbrSeq: ${typeof mbrSeq}, analysis: ${typeof analysisInput})`,
            );
            console.log(
                `From AnalysesService.createAnalysis: ${error.message}`,
            );
            return {
                ok: false,
                error: '분석 결과를 등록하지 못했습니다.',
            };
        }
    }

    async createAnalysisRequest(req: Request) {
        /***
         * TODO
         * - 영상 s3에 업로드(스트리밍?)
         * - 인공지능 돌리는 EC2에 분석 요청
         */
        return { ok: true };
    }

    private async buildAnalysis(
        analysis: CreateAnalysisResultInput,
        mbrSeq: string,
    ): Promise<Analysis> {
        try {
            const newAnalysis = this.analyses.create(analysis);

            newAnalysis.member = new Member();
            newAnalysis.member.mbrSeq = mbrSeq;

            newAnalysis.refVideo = new RefVideo();
            newAnalysis.refVideo.rvSeq = analysis.rvSeq;

            newAnalysis.creatorSeq = mbrSeq;
            newAnalysis.updaterSeq = mbrSeq;

            return newAnalysis;
        } catch (error) {
            error.message = `\nFrom AnalysisService.buildAnalysis: ${error.message}`;
            throw error;
        }
    }
}
