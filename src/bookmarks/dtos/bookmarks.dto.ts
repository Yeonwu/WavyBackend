import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import {
    PaginationInput,
    PaginationOutput,
} from 'src/common/dtos/pagination.dto';
import { RefVideo } from 'src/ref-videos/entities/ref-video.entity';

export class BookmarksInput extends PaginationInput {}

export class BookmarksOutput extends PaginationOutput {
    @ApiPropertyOptional({
        type: [RefVideo],
        description: '보관중인 학습용 동영상',
    })
    @IsOptional()
    bookmarkedRefVideos?: RefVideo[];
}
