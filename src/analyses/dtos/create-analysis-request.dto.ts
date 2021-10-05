import { PickType } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';
import { Analysis } from '../entities/analyses.entity';

export class CreateAnalysisRequestInput extends PickType(Analysis, [
    'anUserVideoURL',
    'rvSeq',
]) {}

export class RegisterAnalysisInQueueInput extends PickType(Analysis, [
    'anSeq',
    'anUserVideoURL',
    'rvSeq',
]) {}
