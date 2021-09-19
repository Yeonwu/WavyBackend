import { Injectable } from '@nestjs/common';
import got from 'got';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { MembersService } from 'src/members/members.service';
import {
    GetJwtOutput,
    GetKakaoTokenOutput,
    getLoggedInMemberOutput,
    UnlinkTokenOutput,
} from './dtos/get-token.dto';
import * as camelcaseKeys from 'camelcase-keys';

@Injectable()
export class AuthService {
    constructor(
        private readonly memberService: MembersService,
        private readonly jwtServce: JwtService,
        private readonly configService: ConfigService,
    ) {}

    getKakaoLoginUrl(): string {
        const hostName = this.configService.get('KAKAO_LOGIN_HOST');
        const clientId = this.configService.get('KAKAO_CLIENT_ID');
        const baseDomain = this.configService.get('BASE_DOMAIN');
        const redirectUrl = `${baseDomain}/auth/kakaoLoginRedirect`;

        const url = `https://${hostName}/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUrl}&response_type=code`;
        return url;
    }

    async getJwt(code: string): Promise<GetJwtOutput> {
        try {
            const kakaoTokens = await this.getKakaoToken(code);
            const mbrKakaoSeq = await this.getMbrKakaoSeq(
                kakaoTokens.accessToken,
            );
            const { ok, error, member } =
                await this.memberService.getMemberByKakaoSeq(mbrKakaoSeq);

            if (!ok) {
                return { ok: false, error };
            }

            const jwtToken = this.createJwt(
                member.mbrSeq,
                kakaoTokens.accessToken,
                kakaoTokens.expiresIn,
            );

            return { ok: true, token: jwtToken };
        } catch (error) {
            console.log(error);
            return {
                ok: false,
                error: '회원 인증에 실패했습니다',
            };
        }
    }

    async unlinkToken(accessToken: string): Promise<UnlinkTokenOutput> {
        try {
            const hostName = this.configService.get('KAKAO_LOGOUT_HOST');
            const url = `https://${hostName}/v1/user/unlink`;

            await got.post(url, {
                headers: {
                    'Content-type':
                        'application/x-www-form-urlencoded;charset=utf-8',
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            return { ok: true };
        } catch (error) {
            console.log(error.message);
            return { ok: false, error: '로그아웃에 실패했습니다' };
        }
    }

    async getLoggedInMember(req: Request): Promise<getLoggedInMemberOutput> {
        try {
            if (req.body.member) {
                return { ok: true, response: req.body.member };
            }
            return { ok: false, error: '회원 정보 조회에 실패했습니다.' };
        } catch (error) {
            console.log(error.message);
            return { ok: false, error: '회원 정보 조회에 실패했습니다.' };
        }
    }

    private async getKakaoToken(code: string): Promise<GetKakaoTokenOutput> {
        try {
            const hostName = this.configService.get('KAKAO_LOGIN_HOST');
            const baseDomain = this.configService.get('BASE_DOMAIN');

            const url = `https://${hostName}/oauth/token`;

            const clientId = this.configService.get('KAKAO_CLIENT_ID');
            const grantType = this.configService.get('KAKAO_GRANT_TYPE');
            const redirectUri = `${baseDomain}/auth/kakaoLoginRedirect`;

            const response: any = await got
                .post(url, {
                    headers: {
                        'Content-type':
                            'application/x-www-form-urlencoded;charset=utf-8',
                    },
                    form: {
                        client_id: clientId,
                        grant_type: grantType,
                        redirect_uri: redirectUri,
                        code,
                    },
                })
                .json();

            const kakaoTokens: GetKakaoTokenOutput = camelcaseKeys(response);

            return kakaoTokens;
        } catch (error) {
            error.message += `\n 
            error args at getKakaoAccessToken \n
            code: ${code}
            `;
            throw error;
        }
    }

    private async getMbrKakaoSeq(accessToken: string): Promise<string> {
        try {
            const response: any = await got
                .get('https://kapi.kakao.com/v2/user/me', {
                    headers: { Authorization: `Bearer ${accessToken}` },
                })
                .json();
            return response.id;
        } catch (error) {
            error.message += `\n
            error args at getMbrKakaoSeq \n
            accessToken: ${accessToken}
            `;
            throw error;
        }
    }

    private UnixEpochTimestamp(): number {
        return Math.floor(new Date().valueOf() / 1000);
    }

    private createJwt(
        mbrSeq: string,
        accessToken: string,
        expires: number,
    ): string {
        return this.jwtServce.sign({
            exp: this.UnixEpochTimestamp() + expires,
            mbrSeq,
            accessToken,
        });
    }
}
