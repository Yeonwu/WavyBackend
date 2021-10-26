import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Tag } from '../entities/tag.entity';

export class TagsOutput extends CoreOutput {
    @ApiProperty({ type: Number, description: '태그 개수' })
    @IsNumber()
    @IsOptional()
    totalResults?: number;

    @ApiPropertyOptional({ type: [Tag], description: '태그 목록' })
    @IsOptional()
    tags?: Tag[];
}
