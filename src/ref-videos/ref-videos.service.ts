import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefVideoOutput } from './dtos/ref-video.dto';
import { RefVideosInput, RefVideosOutput } from './dtos/ref-videos.dto';
import { RefVideo } from './entities/ref-video.entity';

@Injectable()
export class RefVideosService {
    constructor(
        @InjectRepository(RefVideo)
        private readonly refVideos: Repository<RefVideo>,
    ) {}

    async getRefVideos({ page }: RefVideosInput): Promise<RefVideosOutput> {
        try {
            if (!page) {
                page = 1;
            }
            const refVideos = await this.refVideos.find({
                order: {
                    updatedDate: 'DESC',
                },
                take: 9,
                skip: (page - 1) * 9,
            });
            const totalResults = await this.refVideos.count();
            return {
                ok: true,
                totalResults,
                totalPages: Math.ceil(totalResults / 9),
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
