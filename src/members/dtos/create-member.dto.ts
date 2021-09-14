import { Member } from '../entities/members.entity';
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';

export class CreateMemberInput extends PickType(Member, [
    'mbrNickname',
    'certificationMethodCode',
    'profileImageUrl',
    'privacyConsentCode',
    'marketingConsentCode',
    'videoOptionCode',
]) {}
export class CreateMemberOutput {
    @ApiProperty()
    success: boolean;

    @ApiPropertyOptional()
    error?: string;
}
