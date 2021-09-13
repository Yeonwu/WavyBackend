import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
} from '@nestjs/common';
import { RefVideoOutput } from './dtos/ref-video.dto';
import { RefVideosInput, RefVideosOutput } from './dtos/ref-videos.dto';
import { RefVideosService } from './ref-videos.service';

@Controller('ref-videos')
export class RefVideosController {
    constructor(private readonly refVideosService: RefVideosService) {}

    @Get()
    getRefVideos(
        @Body() refVideosInput: RefVideosInput,
    ): Promise<RefVideosOutput> {
        return this.refVideosService.getRefVideos(refVideosInput);
    }

    @Get(':id')
    getRefVideo(@Param('id') refVideoId: string): Promise<RefVideoOutput> {
        return this.refVideosService.findRefVideoById(refVideoId);
    }

    // @Post()
    // postOne() {}

    // @Put(':id')
    // putOne(@Param('id') id: string) {}

    // @Delete(':id')
    // deleteOne(@Param('id') id: string) {}
}
