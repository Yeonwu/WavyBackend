import { PickType } from '@nestjs/swagger';
import { IsJWT, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { KakaoRedirectInput } from './kakao-redirect.dto';

export class GetJwtOutput extends CoreOutput {
    @IsJWT()
    @IsOptional()
    token?: string;
}

export class GetJwtInput extends PickType(KakaoRedirectInput, ['code']) {}

export class UnlinkTokenOutput extends CoreOutput {}

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
