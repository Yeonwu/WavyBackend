import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationInput } from 'src/common/dtos/pagination.dto';
import { Raw, Repository } from 'typeorm';
import { RefVideoOutput } from './dtos/ref-video.dto';
import { RefVideosInput, RefVideosOutput } from './dtos/ref-videos.dto';
import { RefVideo } from './entities/ref-video.entity';
import * as camelcaseKeys from 'camelcase-keys';
import {
    SearchRefVideosInput,
    SearchRefVideosOutput,
} from './dtos/search-ref-videos.dto';

@Injectable()
export class RefVideosService {
    constructor(
        @InjectRepository(RefVideo)
        private readonly refVideos: Repository<RefVideo>,
    ) {}

    async allRefVideos({
        page,
        tagName,
    }: RefVideosInput): Promise<RefVideosOutput> {
        try {
            if (!page) {
                page = '1';
            }
            if (!tagName) {
                tagName = '';
            }
            const sql = `
                SELECT DISTINCT * FROM ref_video
                JOIN(SELECT rv_seq FROM ref_videos_tags AS RVT
                    JOIN (SELECT tag_seq FROM tag WHERE tag_name ILIKE '%${tagName}%') 
                    AS TAG
                    ON TAG.tag_seq = RVT.tag_seq)
                AS RVS
                ON RVS.rv_seq = ref_video.rv_seq
                ORDER BY ref_video.created_date DESC
                LIMIT ${PaginationInput.take}
                OFFSET ${PaginationInput.skip(+page)}
                `;
            const sql2 = `
                SELECT COUNT(DISTINCT ref_video.rv_seq) AS totalresults FROM ref_video
                JOIN(SELECT rv_seq FROM ref_videos_tags AS RVT
                    JOIN (SELECT tag_seq FROM tag WHERE tag_name ILIKE '%${tagName}%') 
                    AS TAG
                    ON TAG.tag_seq = RVT.tag_seq)
                AS RVS
                ON RVS.rv_seq = ref_video.rv_seq
                `;

            const sqlRawResults = await this.refVideos.manager.query(sql);
            const sql2RawResults = await this.refVideos.manager.query(sql2);
            if (!sqlRawResults || !sql2RawResults) {
                return {
                    ok: false,
                    error: '학습용 동영상을 찾을 수 없습니다',
                };
            }
            const refVideos = camelcaseKeys(sqlRawResults);
            const { totalresults } = sql2RawResults[0];
            const totalPages = Math.ceil(totalresults / PaginationInput.take);
            return {
                ok: true,
                totalResults: +totalresults,
                totalPages,
                refVideos,
            };
        } catch (error) {
            return {
                ok: false,
                error: '학습용 동영상을 찾을 수 없습니다',
            };
        }
    }

    async findRefVideoById(refVideoId: string): Promise<RefVideoOutput> {
        try {
            const refVideo = await this.refVideos.findOne(+refVideoId);
            if (!refVideo) {
                return {
                    ok: false,
                    error: '학습용 동영상이 존재하지 않습니다',
                };
            }
            return {
                ok: true,
                refVideo,
            };
        } catch (error) {
            return {
                ok: false,
                error: '학습용 동영상을 찾을 수 없습니다',
            };
        }
    }

    async searchRefVideos({
        page,
        query,
    }: SearchRefVideosInput): Promise<SearchRefVideosOutput> {
        try {
            if (!page) {
                page = '1';
            }
            const [refVideos, totalResults] = await this.refVideos.findAndCount(
                {
                    where: [
                        {
                            rvSourceTitle: Raw(
                                (title) => `${title} ILIKE '%${query}%'`,
                            ),
                        },
                        {
                            rvSourceAccountName: Raw(
                                (accountName) =>
                                    `${accountName} ILIKE '%${query}%'`,
                            ),
                        },
                        {
                            rvSongName: Raw(
                                (songName) => `${songName} ILIKE '%${query}%'`,
                            ),
                        },
                        {
                            rvArtistName: Raw(
                                (artistName) =>
                                    `${artistName} ILIKE '%${query}%'`,
                            ),
                        },
                    ],
                    take: PaginationInput.take,
                    skip: PaginationInput.skip(+page),
                },
            );
            if (!refVideos) {
                return {
                    ok: false,
                    error: '검색결과를 찾을 수 없습니다',
                };
            }
            return {
                ok: true,
                totalResults,
                totalPages: Math.ceil(totalResults / PaginationInput.take),
                refVideos,
            };
        } catch {
            return {
                ok: false,
                error: '검색결과를 찾을 수 없습니다',
            };
        }
    }
}
