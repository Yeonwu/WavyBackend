import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TagsOutput } from './dtos/tags.dto';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagsService {
    constructor(
        @InjectRepository(Tag) private readonly tags: Repository<Tag>,
    ) {}

    async allTags(): Promise<TagsOutput> {
        try {
            const [tags, totalResults] = await this.tags.findAndCount({
                take: 20,
            });
            if (!tags) {
                return {
                    ok: false,
                    error: '태그를 찾을 수 없습니다',
                };
            }
            return {
                ok: true,
                totalResults,
                tags,
            };
        } catch (error) {
            return {
                ok: false,
                error: '태그를 찾을 수 없습니다',
            };
        }
    }
}
