import { PartialType, PickType } from '@nestjs/swagger';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Member } from '../entities/members.entity';

export class UpdateMemberInput extends PartialType(
    PickType(Member, ['mbrNickname', 'videoOptionCode', 'profileImageUrl']),
) {}
export class UpdateMemberOutput extends CoreOutput {}
