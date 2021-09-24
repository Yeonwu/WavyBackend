import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { CoreOutput } from './output.dto';

export class PaginationInput {

    @ApiProperty({ type: String, description: '요청한 페이지 숫자' })
    @IsString()
    page: string;

    static take = 9;
    static skip: (page: number) => number = (page) =>
        (page - 1) * PaginationInput.take;
}

export class PaginationOutput extends CoreOutput {
    @ApiPropertyOptional({ type: Number, description: '전체 페이지 개수' })
    @IsNumber()
    @IsOptional()
    totalPages?: number;

    @ApiPropertyOptional({ type: Number, description: '전체 결과 데이터 개수' })
    @IsNumber()
    @IsOptional()
    totalResults?: number;
}
