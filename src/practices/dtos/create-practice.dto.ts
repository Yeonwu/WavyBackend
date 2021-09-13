import { CoreOutput } from 'src/common/dtos/output.dto';
import { Practice } from '../entities/practice.entity';
import { PickType } from '@nestjs/mapped-types';

export class CreatePracticeInput extends PickType(Practice, [
    'ptStarted',
    'ptFinished',
    'ptVideoTypeCode',
    'ptVideoUrl',
]) {}

export class CreatePracticeOutput extends CoreOutput {
    practice?: Practice;
}
