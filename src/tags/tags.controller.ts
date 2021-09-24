import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TagsOutput } from './dtos/tags.dto';
import { TagsService } from './tags.service';
@ApiTags('태그')
@Controller('tags')
export class TagsController {
    constructor(private readonly tagsService: TagsService) {}

    @ApiOperation({
        summary: '태그 목록 조회',
        description: '태그 목록을 가져온다',
    })
    @ApiOkResponse({
        description: '태그 목록을 가져온다',
        type: TagsOutput,
    })
    @Get()
    getTags(): Promise<TagsOutput> {
        return this.tagsService.allTags();
    }
}
