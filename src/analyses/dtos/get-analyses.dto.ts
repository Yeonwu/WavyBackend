import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { PaginationOutput } from 'src/common/dtos/pagination.dto';
import { Analysis } from '../entities/analyses.entity';

export class GetAnalysesOutput extends PaginationOutput {
    @ApiPropertyOptional({
        description: '분석 결과 목록',
        isArray: true,
        type: Analysis,
    })
    @IsOptional()
    analyses?: Analysis[];
}

export class GetAnalysisBySeqOutput extends CoreOutput {
    @ApiPropertyOptional({
        description: '분석결과',
        type: Analysis,
    })
    @IsOptional()
    analysis?: Analysis;

    @ApiPropertyOptional({
        description: '분석 결과 json',
    })
    @IsOptional()
    simularityJson?: any;
}

export class GetAnalysesBySeqInput {
    @ApiProperty({
        description: '분석결과 ID',
        type: String,
    })
    @IsString()
    id: string;
}
