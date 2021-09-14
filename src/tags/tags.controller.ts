import { Controller, Get } from '@nestjs/common';
import { TagsOutput } from './dtos/tags.dto';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
    constructor(private readonly tagsService: TagsService) {}
    @Get()
    getTags(): Promise<TagsOutput> {
        return this.tagsService.allTags();
    }
}
