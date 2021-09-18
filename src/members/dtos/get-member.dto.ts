import { ApiProperty } from '@nestjs/swagger';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Member } from '../entities/members.entity';

export class GetMemberEntity extends Member {}
export class GetMemberOutput extends CoreOutput {
    @ApiProperty()
    member?: GetMemberEntity;
}
