import {
    Controller,
    Get,
    Query,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiExcludeEndpoint,
    ApiOkResponse,
    ApiOperation,
    ApiQuery,
    ApiTags,
} from '@nestjs/swagger';
import { StartMLInstanceInterceptor } from 'src/aws/aws-ml-instance.interceptor';
import { AuthJwt } from './auth-jwt.decorator';
import { AccessTokenGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { AuthJwtDecoded } from './dtos/auth-jwt-core';
import { GetKakoLoginUrlOutput } from './dtos/get-kakak-login-url.dto';
import {
    GetJwtInput,
    GetJwtOutput,
    UnlinkTokenOutput,
} from './dtos/get-token.dto';
import { KakaoRedirectInput } from './dtos/kakao-redirect.dto';

@ApiTags('인증')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
    ) {}

    @ApiOperation({
        summary: '카카오 로그인 URL 받기',
        description: `카카오 로그인 창으로 들어가는 URL을 받아옵니다.`,
    })
    @ApiOkResponse({
        description: '카카오 로그인 창으로 들어가는 URL을 받아옵니다.',
        type: GetKakoLoginUrlOutput,
    })
    @Get('kakaoLogin')
    getKakaoLogin() {
        return this.authService.getKakaoLoginUrl();
    }

    @ApiOperation({
        summary: '카카오 로그인 후 리다이렉트되는 URL',
    })
    @ApiQuery({
        type: KakaoRedirectInput,
    })
    @Get('kakaoLoginRedirect')
    kakaoLoginRedirect(@Query() query: KakaoRedirectInput) {
        const { code, state, error, error_description } = query;
        if (error) {
            console.log(`${state} / ${error}: ${error_description}`);
            return { ok: false, error: '카카오 로그인에 실패했습니다.' };
        }
        return { ok: true };
    }

    @ApiOperation({
        summary: '인증 가능한 토큰을 발급',
        description:
            '/auth/kakaoLoginRedirect에서 url로 받은 토큰을 가지고 본 API로 요청시 인증 가능한 토큰을 발급받을 수 있음.',
    })
    @ApiOkResponse({
        description: '토큰 정상 발급',
        type: GetJwtOutput,
    })
    @ApiBadRequestResponse({
        description: '토큰 발급 실패 ',
        type: GetJwtOutput,
    })
    @Get('token')
    @UseInterceptors(StartMLInstanceInterceptor)
    getJwtToken(@Query() getJwtInput: GetJwtInput): Promise<GetJwtOutput> {
        return this.authService.getJwt(getJwtInput);
    }

    @ApiOperation({
        summary: '카카오 로그아웃 Url',
        description:
            '카카오로 가입한 회원이 로그아웃시 호출해 주신 후 jwt를 저장해 놓았을 경우 지워주세요.',
    })
    @ApiOkResponse({
        description: '회원 로그아웃 완료',
        type: UnlinkTokenOutput,
    })
    @ApiBearerAuth('access-token')
    @Get('kakaoLogout')
    @UseGuards(AccessTokenGuard)
    async kakaoLogout(
        @AuthJwt() jwt: AuthJwtDecoded,
    ): Promise<UnlinkTokenOutput> {
        const accessToken = jwt.accessToken;
        return await this.authService.unlinkToken(accessToken);
    }

    @ApiExcludeEndpoint()
    @Get('test/login')
    getLoginPage() {
        return `<div>
            <h1>카카오 로그인</h1>
            <form action="/auth/kakaoLogin" method="GET">
              <input type="submit" value="카카오로그인" />
            </form>
            <form action="/auth/kakaoLogout" method="GET">
              <input type="submit" value="카카오로그아웃 및 연결 끊기" />
            </form>
          </div>
        `;
    }
}
