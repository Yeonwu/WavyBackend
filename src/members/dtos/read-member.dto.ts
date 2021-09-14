import { ApiProperty } from '@nestjs/swagger';
import { Member } from '../entities/members.entity';
import { CreateMemberOutput } from './create-member.dto';

export class ReadMemberEntity extends Member {}
export class ReadMemberOutput extends CreateMemberOutput {
    @ApiProperty()
    member?: ReadMemberEntity;
}
