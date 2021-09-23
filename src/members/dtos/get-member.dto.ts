import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Member } from '../entities/members.entity';

export class GetMemberEntity extends OmitType(Member, ['mbrKakaoSeq']) {}
export class GetMemberOutput extends CoreOutput {
    @ApiProperty()
    member?: GetMemberEntity;
}

export class getLoggedInMemberOutput extends CoreOutput {
    @IsOptional()
    response?: {
        member: Member;
    };
}
