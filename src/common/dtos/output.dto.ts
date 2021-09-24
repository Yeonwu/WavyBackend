import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CoreOutput {
    @ApiPropertyOptional({ type: String, description: '오류 메세지' })
    @IsString()
    @IsOptional()
    error?: string;

    @ApiProperty({ type: Boolean, description: '요청 성공 여부' })
    @IsBoolean()
    ok: boolean;
}
