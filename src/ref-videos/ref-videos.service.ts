import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationInput } from 'src/common/dtos/pagination.dto';
import { Repository } from 'typeorm';
import { RefVideoOutput } from './dtos/ref-video.dto';
import { RefVideosInput, RefVideosOutput } from './dtos/ref-videos.dto';
import { RefVideo } from './entities/ref-video.entity';
import * as camelcaseKeys from 'camelcase-keys';

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
                page = 1;
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
                OFFSET ${PaginationInput.skip(page)}
            `;
            let refVideos = await this.refVideos.manager.query(sql);
            refVideos = camelcaseKeys(refVideos);
            return {
                ok: true,
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
}
