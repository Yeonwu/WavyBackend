import {
    Controller,
    Get,
    Param,
    Query,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { GetTokenPostData } from './dtos/get-token.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
    ) {}

    @Get('me')
    @UseGuards(AuthGuard)
    getLoggedInMember(@Req() req: Request) {
        if (req.hasOwnProperty('member')) {
            return { ok: true, response: req['member'] };
        } else {
            return { ok: false, error: '회원 정보 조회에 실패했습니다.' };
        }
    }

    @Get('login')
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

    @Get('kakaoLogin')
    getKakaoLogin(@Res() res) {
        const _hostName = 'kauth.kakao.com';
        const _restApiKey = this.configService.get('KAKAO_CLIENT_ID');
        const _redirectUrl = `${this.configService.get(
            'BASE_DOMAIN',
        )}/auth/kakaoLoginRedirect`;

        const url = `https://${_hostName}/oauth/authorize?client_id=${_restApiKey}&redirect_uri=${_redirectUrl}&response_type=code`;
        return res.redirect(url);
    }

    // @Get('kakaoLogout')
    // getKakaoLogout() {
    //     const _hostName = 'kauth.kakao.com';
    //     const _restApiKey = this.configService.get('KAKAO_CLIENT_ID');
    //     const url = `https://${_hostName}/v1/user/unlink`;

    // }

    @Get('kakaoLoginRedirect')
    kakaoLoginRedirect(
        @Query('code') code: string,
        @Param('state') state?: string,
        @Param('error') error?: string,
        @Param('error_description') error_description?: string,
    ) {
        const _hostName = 'kauth.kakao.com';
        const _restApiKey = this.configService.get('KAKAO_CLIENT_ID');
        const _redirectUri = `${this.configService.get(
            'BASE_DOMAIN',
        )}/auth/kakaoLoginRedirect`;

        const _url = `https://${_hostName}/oauth/token`;
        const _data: GetTokenPostData = {
            grantType: 'authorization_code',
            clientId: _restApiKey,
            redirectUri: _redirectUri,
            code,
        };
        return this.authService.getToken(_url, _data);
    }

    @Get('login-success')
    getLoginSuccess() {
        return `aaaa`;
    }
}
