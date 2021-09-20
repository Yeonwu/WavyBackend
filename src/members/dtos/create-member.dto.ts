import { Member } from '../entities/members.entity';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { AuthJwtDecoded } from 'src/auth/dtos/auth-jwt-core';
import { IsJWT } from 'class-validator';

export class CreateMemberInput extends PickType(Member, [
    'mbrEmail',
    'mbrNickname',
    'certificationMethodCode',
    'profileImageUrl',
    'privacyConsentCode',
    'marketingConsentCode',
    'videoOptionCode',
    'mbrKakaoSeq',
]) {}

export class CreateMemberOutput extends CoreOutput {
    @ApiProperty()
    member?: Member;

    @IsJWT()
    token?: string;
}
