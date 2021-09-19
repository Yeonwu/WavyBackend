import { IsJWT, IsNumber, IsOptional, IsString } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Member } from 'src/members/entities/members.entity';

export class GetJwtOutput extends CoreOutput {
    @IsJWT()
    @IsOptional()
    token?: string;
}

export class UnlinkTokenOutput extends CoreOutput {}

export class getLoggedInMemberOutput extends CoreOutput {
    @IsOptional()
    response?: {
        member: Member;
    };
}

export class GetKakaoTokenOutput extends CoreOutput {
    @IsString()
    @IsOptional()
    tokenType?: string;

    @IsString()
    @IsOptional()
    accessToken?: string;

    @IsNumber()
    @IsOptional()
    expiresIn?: number;

    @IsString()
    @IsOptional()
    refreshToken?: string;

    @IsNumber()
    @IsOptional()
    refreshTokenExpiresIn?: number;

    @IsString()
    @IsOptional()
    scope?: string;
}
