import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Member } from 'src/members/entities/members.entity';
import { AuthJwt } from './auth-jwt.decorator';
import { AuthMember } from './auth-member.decorator';
import { AccessTokenGuard, MemberGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { AuthJwtDecoded } from './dtos/auth-jwt-core';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
    ) {}

    @Get('kakaoLogin')
    getKakaoLogin(@Res() res) {
        const url = this.authService.getKakaoLoginUrl();
        return res.redirect(url);
    }

    @Get('kakaoLoginRedirect')
    kakaoLoginRedirect(
        @Query('code') code: string,
        @Query('state') state?: string,
        @Query('error') error?: string,
        @Query('error_description') error_description?: string,
    ) {
        if (error) {
            console.log(`${state} / ${error}: ${error_description}`);
            return { ok: false, error: '카카오 로그인에 실패했습니다.' };
        }

        return this.authService.getJwt(code);
    }

    @Get('kakaoLogout')
    @UseGuards(AccessTokenGuard)
    kakaoLogout(@AuthJwt() jwt: AuthJwtDecoded) {
        const accessToken = jwt.accessToken;
        return this.authService.unlinkToken(accessToken);
    }

    @Get('me')
    @UseGuards(MemberGuard)
    getLoggedInMember(@AuthMember() member: Member) {
        return this.authService.getLoggedInMember(member);
    }

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
