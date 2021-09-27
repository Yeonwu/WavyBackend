import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
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
    @ApiPropertyOptional({
        name: 'expHistory',
        description: '회원 경험치 이력',
        type: CreateMbrExpHistoryEntity,
    })
    @IsOptional()
    expHistory?: CreateMbrExpHistoryEntity;
}
