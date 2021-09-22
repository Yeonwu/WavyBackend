import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RefVideoOutput } from './dtos/ref-video.dto';
import { RefVideosInput, RefVideosOutput } from './dtos/ref-videos.dto';
import {
    SearchRefVideosInput,
    SearchRefVideosOutput,
} from './dtos/search-ref-videos.dto';
import { RefVideosService } from './ref-videos.service';
@ApiTags('학습용 동영상')
@Controller('ref-videos')
export class RefVideosController {
    constructor(private readonly refVideosService: RefVideosService) {}

    @ApiOperation({
        summary: '학습용 동영상 목록 조회',
        description: '학습용 동영상 목록을 가져온다',
    })
    @ApiOkResponse({
        description: '학습용 동영상 목록을 가져온다',
        type: RefVideosOutput,
    })
    @Get()
    getRefVideos(
        @Query() refVideosInput: RefVideosInput,
    ): Promise<RefVideosOutput> {
        return this.refVideosService.allRefVideos(refVideosInput);
    }

    @ApiOperation({
        summary: '학습용 동영상 검색',
        description: '학습용 동영상 검색결과를 가져온다',
    })
    @ApiOkResponse({
        description: '학습용 동영상 검색결과를 가져온다',
        type: SearchRefVideosOutput,
    })
    @Get('search')
    searchRefVideos(
        @Query() searchRefVideosInput: SearchRefVideosInput,
    ): Promise<SearchRefVideosOutput> {
        return this.refVideosService.searchRefVideos(searchRefVideosInput);
    }

    @ApiOperation({
        summary: '학습용 동영상 조회',
        description: '학습용 동영상 조회결과를 가져온다',
    })
    @ApiOkResponse({
        description: '학습용 동영상 조회결과를 가져온다',
        type: RefVideoOutput,
    })
    @Get(':id')
    getRefVideo(@Param('id') refVideoId: string): Promise<RefVideoOutput> {
        return this.refVideosService.findRefVideoById(refVideoId);
    }
}
