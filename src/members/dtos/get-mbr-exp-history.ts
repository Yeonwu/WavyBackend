import { PickType } from '@nestjs/swagger';
import { MemberExpHistory } from '../entities/mbr-exp-history.entity';

export class GetMbrExpHistoryOutput extends PickType(MemberExpHistory, [
    'mehExpAcc',
    'mehLevel',
    'mehTier',
]) {}
