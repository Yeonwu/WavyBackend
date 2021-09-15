import { OmitType, PartialType } from '@nestjs/swagger';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Member } from '../entities/members.entity';

export class UpdateMemberInput extends PartialType(
    OmitType(Member, ['mbrNickname', 'videoOptionCode']),
) {}
export class UpdateMemberOutput extends CoreOutput {}
