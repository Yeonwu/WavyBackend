import { PickType } from '@nestjs/swagger';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { MemberExpHistory } from '../entities/mbr-exp-history.entity';

export class GetMbrExpHistoryEntity extends PickType(MemberExpHistory, [
    'mehExpAcc',
    'mehLevel',
    'mehTier',
]) {}

export class GetMbrExpHistoryOutput extends CoreOutput {
    expHistory?: GetMbrExpHistoryEntity;
}
