import { Member } from '../entities/members.entity';
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { CoreOutput } from 'src/common/dtos/output.dto';

export class CreateMemberInput extends PickType(Member, [
    'mbrEmail',
    'mbrNickname',
    'certificationMethodCode',
    'profileImageUrl',
    'privacyConsentCode',
    'marketingConsentCode',
    'videoOptionCode',
]) {}
export class CreateMemberOutput extends CoreOutput {}
