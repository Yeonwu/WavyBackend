import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import {
    PaginationInput,
    PaginationOutput,
} from 'src/common/dtos/pagination.dto';
import { RefVideo } from '../entities/ref-video.entity';

export class SearchRefVideosInput extends PaginationInput {
    @ApiProperty({ type: String, description: '검색 키워드' })
    @IsString()
    query: string;
}

export class SearchRefVideosOutput extends PaginationOutput {
    @ApiPropertyOptional({
        type: [RefVideo],
        description: '검색된 학습용 동영상',
    })
    @IsOptional()
    refVideos?: RefVideo[];
}
