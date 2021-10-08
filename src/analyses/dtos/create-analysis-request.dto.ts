import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { Analysis } from '../entities/analyses.entity';

export class CreateAnalysisRequestInput extends PickType(Analysis, [
    'anUserVideoFilename',
    'rvSeq',
]) {
    @ApiProperty({
        description:
            '반전 효과 적용 여부. 반전효과를 서버에서 넣어줘야 할 경우 True로 설정해주세요.',
        type: Boolean,
    })
    @IsBoolean()
    mirrorEffect: boolean;
}

export class RegisterAnalysisInQueueInput extends PickType(Analysis, [
    'anSeq',
    'anUserVideoFilename',
    'rvSeq',
]) {}
