import { PickType } from '@nestjs/swagger';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { MemberExpHistory } from '../entities/mbr-exp-history.entity';

export class CreateMbrExpHistoryInput extends PickType(MemberExpHistory, [
    'mehExpGained',
]) {}

export class CreateMbrExpHistoryEntity extends PickType(MemberExpHistory, [
    'mehExpAcc',
    'mehExpGained',
    'mehLevel',
    'mehSeq',
    'mehTier',
]) {}

export class CreateMbrExpHistoryOutput extends CoreOutput {
    expHistory?: CreateMbrExpHistoryEntity;
}
