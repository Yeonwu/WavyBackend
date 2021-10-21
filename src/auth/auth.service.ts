import { forwardRef, Inject, Injectable } from '@nestjs/common';
import got from 'got';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MembersService } from 'src/members/members.service';
import {
    GetJwtInput,
    GetJwtOutput,
    GetKakaoTokenOutput,
    UnlinkTokenOutput,
} from './dtos/get-token.dto';
import * as camelcaseKeys from 'camelcase-keys';
import { GetKakoLoginUrlOutput } from './dtos/get-kakak-login-url.dto';

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => MembersService))
        private readonly memberService: MembersService,
        private readonly jwtServce: JwtService,
        private readonly configService: ConfigService,
    ) {}

    getKakaoLoginUrl(): GetKakoLoginUrlOutput {
        try {
            const hostName = this.configService.get('KAKAO_LOGIN_HOST');
            const clientId = this.configService.get('KAKAO_CLIENT_ID');
            const baseDomain = 'http://localhost:3000';
            const redirectUrl = `${baseDomain}/auth/kakaoLoginRedirect`;

            const url = `https://${hostName}/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUrl}&response_type=code`;
            return { ok: true, url };
        } catch (error) {
            console.log(error.stack, error.message);
            return {
                ok: false,
                error: '카카오 로그인 URL을 받아오지 못했습니다.',
            };
        }
    }

    async getJwt(getJwtInput: GetJwtInput): Promise<GetJwtOutput> {
        try {
            const { code, redirectUrl } = getJwtInput;
            const kakaoTokens = await this.getKakaoToken(code, redirectUrl);
            const mbrKakaoSeq = await this.getMbrKakaoSeq(
                kakaoTokens.accessToken,
            );
            const { member } = await this.memberService.getMemberByKakaoSeq(
                mbrKakaoSeq,
            );

            const jwtToken = this.createJwt(
                member?.mbrSeq,
                kakaoTokens.accessToken,
                this.UnixEpochTimestamp() + kakaoTokens.expiresIn,
            );

            return { ok: true, token: jwtToken };
        } catch (error) {
            console.log(error.stack, error.message);
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

    private async getKakaoToken(
        code: string,
        redirectUrl: string,
    ): Promise<GetKakaoTokenOutput> {
        try {
            const hostName = this.configService.get('KAKAO_LOGIN_HOST');
            const baseDomain = redirectUrl;

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
            error args at getKakaoToken \n
            code: ${code} \n
            response body: ${error.response.body}
            `;
            throw error;
        }
    }

    async getMbrKakaoSeq(accessToken: string): Promise<string> {
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

    createJwt(mbrSeq: string, accessToken: string, exp: number): string {
        return this.jwtServce.sign({
            mbrSeq,
            exp,
            accessToken,
        });
    }
}
