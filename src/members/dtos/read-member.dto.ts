import { ApiProperty } from '@nestjs/swagger';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Member } from '../entities/members.entity';

export class ReadMemberEntity extends Member {}
export class ReadMemberOutput extends CoreOutput {
    @ApiProperty()
    member?: ReadMemberEntity;
}
