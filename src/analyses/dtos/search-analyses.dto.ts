import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { string } from 'joi';
import { PaginationInput } from 'src/common/dtos/pagination.dto';
import { SearchAnalysesOrderBy } from '../enum/analysis-search-orderby.enum';

export class SearchAnalysisInput extends PaginationInput {
    @ApiPropertyOptional({
        description: '정렬 옵션',
        enum: SearchAnalysesOrderBy,
    })
    @IsString()
    @IsOptional()
    orderby?: string;

    @ApiPropertyOptional({
        description: '검색키워드',
        type: String,
    })
    @IsString()
    @IsOptional()
    q?: string;
}
