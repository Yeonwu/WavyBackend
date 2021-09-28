import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class KakaoRedirectInput {
    @ApiPropertyOptional({
        description: '카카오 토큰을 발급받는 코드',
    })
    @IsString()
    code: string;

    @ApiPropertyOptional({
        description: 'CSRF 공격 차단을 위한 파라미터',
    })
    state?: string;

    @ApiPropertyOptional({
        description: '카카오 에러 코드',
    })
    @IsOptional()
    error?: string;

    @ApiPropertyOptional({
        description: '카카오 에러 설명',
    })
    @IsOptional()
    error_description?: string;
}
