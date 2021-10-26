import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Analysis } from '../entities/analyses.entity';

export class CreateAnalysisResultInput extends OmitType(Analysis, [
    'createdDate',
    'updatedDate',
    'creatorSeq',
    'updaterSeq',
    'mbrSeq',
    'anDeleted',
    'refVideo',
    'rvSeq',
    'anUserVideoFilename',
    'anUserVideoDuration',
]) {}

export class CreateAnalysisResultOutput extends CoreOutput {
    @ApiProperty({
        description: '분석결과',
        type: Analysis,
    })
    @IsOptional()
    analysis?: Analysis;
}
