import { PickType } from '@nestjs/swagger';
import { MemberExpHistory } from '../entities/mbr-exp-history.entity';

export class CreateMbrExpHistoryInput extends PickType(MemberExpHistory, [
    'mehExpGained',
]) {}

export class CreateMbrExpHistoryOutput extends PickType(MemberExpHistory, [
    'mehExpAcc',
    'mehExpGained',
    'mehLevel',
    'mehSeq',
    'mehTier',
]) {}
