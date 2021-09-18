import { Injectable } from '@nestjs/common';
import { GetTokenPostData } from './dtos/get-token.dto';
import got from 'got';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from 'src/members/entities/members.entity';
import { Repository } from 'typeorm';
import { compile, options } from 'joi';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtServce: JwtService,
        @InjectRepository(Member)
        private readonly members: Repository<Member>,
    ) {}
    async getToken(url: string, data: GetTokenPostData) {
        try {
            console.log(data);
            const getAccessToken: any = await got
                .post(url, {
                    headers: {
                        'Content-type':
                            'application/x-www-form-urlencoded;charset=utf-8',
                    },
                    form: {
                        client_id: data.clientId,
                        grant_type: data.grantType,
                        redirect_uri: data.redirectUri,
                        code: data.code,
                    },
                })
                .json();
            const accessToken = getAccessToken.access_token;

            const getKakaoMbrSeq: any = await got
                .get('https://kapi.kakao.com/v2/user/me', {
                    headers: { Authorization: `Bearer ${accessToken}` },
                })
                .json();

            const member = await this.members.findOne({
                where: {
                    mbrKakaoSeq: getKakaoMbrSeq.id,
                },
            });
            console.log(member);

            const jwtToken = this.jwtServce.sign({
                mbrSeq: member.mbrSeq,
                accessToken,
            });
            console.log(jwtToken);

            return jwtToken;
        } catch (error) {
            console.log(error);
            return {
                ok: false,
                error: '회원 인증에 실패했습니다',
            };
        }
    }
    async unlinkToken(url: string) {}
}
