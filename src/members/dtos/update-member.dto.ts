import { OmitType, PartialType } from '@nestjs/swagger';
import { Member } from '../entities/members.entity';
import { CreateMemberOutput } from './create-member.dto';

export class UpdateMemberInput extends PartialType(Member) {}
// export class UpdateMemberInput extends PartialType(
//     OmitType(Member, ['mbrNickname', 'videoOptionCode']),
// ) {}
export class UpdateMemberOutput extends CreateMemberOutput {}
