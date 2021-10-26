import { ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { MemberExpHistory } from '../entities/mbr-exp-history.entity';

export class GetMbrExpHistoryEntity extends PickType(MemberExpHistory, [
    'mehExpAcc',
    'mehLevel',
    'mehTier',
]) {}

export class GetMbrExpHistoryOutput extends CoreOutput {
    @ApiPropertyOptional({
        name: 'expHistory',
        description: '회원 경험치 이력',
        type: GetMbrExpHistoryEntity,
    })
    @IsOptional()
    expHistory?: GetMbrExpHistoryEntity;
}
