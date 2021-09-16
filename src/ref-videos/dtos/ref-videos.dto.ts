import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import {
    PaginationInput,
    PaginationOutput,
} from 'src/common/dtos/pagination.dto';
import { RefVideo } from '../entities/ref-video.entity';

export class RefVideosInput extends PaginationInput {
    @ApiPropertyOptional({
        type: String,
        description: '학습용 동영상 목록 조회용 태그',
    })
    @IsString()
    @IsOptional()
    tagName?: string;
}

export class RefVideosOutput extends PaginationOutput {
    @ApiPropertyOptional({
        type: [RefVideo],
        description: '학습용 동영상 목록 조회결과',
    })
    @IsOptional()
    refVideos?: RefVideo[];
}
