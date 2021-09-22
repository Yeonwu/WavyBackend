import { OmitType } from '@nestjs/swagger';
import { Analysis } from '../entities/analyses.entity';

export class CreateAnalysisResultInput extends OmitType(Analysis, [
    'createdDate',
    'updatedDate',
    'creatorSeq',
    'updaterSeq',
    'mbrSeq',
    'anSeq',
    'anDeleted',
]) {}
