import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsJWT, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { KakaoRedirectInput } from './kakao-redirect.dto';

export class GetJwtOutput extends CoreOutput {
    @IsJWT()
    @IsOptional()
    token?: string;
}

export class GetJwtInput extends PickType(KakaoRedirectInput, ['code']) {
    @ApiProperty({
        description:
            '리다이렉트할 url입니다. ex) http://localhost:3000/auth/kakaoLoginRedirect(O), https://www.wavy.dance/auth/kakaoLoginRedirect(O), https://wavy.dance(X) www.wavy.dance(X)',
        type: String,
    })
    @IsString()
    redirectUrl: string;
}

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
