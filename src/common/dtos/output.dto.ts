import { IsBoolean, IsString } from 'class-validator';

export class CoreOutput {
    @IsString()
    error?: string;

    @IsBoolean()
    ok: boolean;
}
