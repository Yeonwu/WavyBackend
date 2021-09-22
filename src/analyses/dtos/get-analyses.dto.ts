import { IsOptional } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Analysis } from '../entities/analyses.entity';

export class GetAnalysesOutput extends CoreOutput {
    @IsOptional()
    analyses?: Analysis[];
}

export class GetAnalysisBySeqOutput extends CoreOutput {
    @IsOptional()
    analysis?: Analysis;
}
