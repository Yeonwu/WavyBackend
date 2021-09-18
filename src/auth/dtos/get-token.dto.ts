import { IsNumber, IsString, IsUrl } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';

export class GetTokenPostData {
    @IsString()
    grantType: string;

    @IsString()
    clientId: string;

    @IsUrl()
    redirectUri: string;

    @IsString()
    code: string;
}

export class GetTokenOutput extends CoreOutput {
    @IsString()
    tokenType?: string;

    @IsString()
    accessToken?: string;

    @IsNumber()
    expiresIn?: number;

    @IsString()
    refreshToken?: string;

    @IsNumber()
    refreshTokenExpiresIn?: number;

    @IsString()
    scope?: string;
}
