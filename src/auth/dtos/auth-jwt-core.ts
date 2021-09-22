import { IsNumber, IsOptional, IsString } from 'class-validator';

export class AuthJwtDecoded {
    @IsString()
    accessToken: string;

    @IsNumber()
    exp: number;

    @IsString()
    @IsOptional()
    mbrSeq?: string;

    @IsNumber()
    iat: number;
}
