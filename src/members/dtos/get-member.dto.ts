import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Member } from '../entities/members.entity';

export class GetMemberEntity extends OmitType(Member, ['mbrKakaoSeq']) {}
export class GetMemberOutput extends CoreOutput {
    @ApiPropertyOptional({
        description: '회원정보',
        type: GetMemberEntity,
    })
    @ApiProperty()
    member?: GetMemberEntity;
}

export class getLoggedInMemberOutput extends CoreOutput {
    @ApiPropertyOptional({
        description: '회원 정보',
        type: GetMemberEntity,
    })
    @IsOptional()
    member?: GetMemberEntity;
}
