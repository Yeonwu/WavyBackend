import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class KakaoRedirectInput {
    @ApiPropertyOptional({
        description: '카카오 토큰을 발급받는 코드.',
    })
    @IsString()
    code: string;

    @ApiPropertyOptional({
        description:
            'CSRF 공격 차단을 위한 파라미터. 아직 개발되지는 않았지만, 카카오 공식문서애 표시되어 있어서 넣었습니다.',
    })
    state?: string;

    @ApiPropertyOptional({
        description:
            '카카오 에러 코드. 코드 발급 중 에러 발생시에만 넘겨줍니다.',
    })
    @IsOptional()
    error?: string;

    @ApiPropertyOptional({
        description:
            '카카오 에러 설명. 코드 발급 중 에러 발생시에만 넘겨줍니다.',
    })
    @IsOptional()
    error_description?: string;
}
