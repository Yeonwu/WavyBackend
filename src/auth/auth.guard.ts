import {
    CanActivate,
    ExecutionContext,
    HttpStatus,
    Injectable,
} from '@nestjs/common';
import got from 'got';
import { Member } from 'src/members/entities/members.entity';
import { AuthJwtDecoded } from './dtos/auth-jwt-core';

abstract class CoreGuard implements CanActivate {
    private headers: Record<string, string>;

    async isAccessTokenValid(): Promise<boolean> {
        try {
            const rawJwt = this.headers['x-jwt-decoded'];
            const parsedJwt: AuthJwtDecoded = JSON.parse(rawJwt);
            if (parsedJwt.accessToken) {
                const url = 'https://kapi.kakao.com/v1/user/access_token_info';
                const response = await got.get(url, {
                    headers: {
                        Authorization: `Bearer ${parsedJwt.accessToken}`,
                    },
                });
                return response.statusCode === HttpStatus.OK;
            }
            return false;
        } catch (error) {
            console.log(error.stack, error.message);
            return false;
        }
    }

    async isMemberValid() {
        try {
            const rawMember = this.headers['x-member'];
            if (rawMember) {
                const parsedMember: Member = JSON.parse(rawMember);
                if (parsedMember.mbrSeq) {
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.log(error.stack, error.message);
            return false;
        }
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            this.headers = context.switchToHttp().getRequest().headers;
            return await this.validate();
        } catch (error) {
            console.log(error.stack, error.message);
            return false;
        }
    }

    abstract validate(): Promise<boolean>;
}

@Injectable()
export class AccessTokenGuard extends CoreGuard {
    async validate(): Promise<boolean> {
        return this.isAccessTokenValid();
    }
}

@Injectable()
export class MemberGuard extends CoreGuard {
    async validate(): Promise<boolean> {
        const promise =
            (await this.isAccessTokenValid()) && (await this.isMemberValid());
        return promise;
    }
}
