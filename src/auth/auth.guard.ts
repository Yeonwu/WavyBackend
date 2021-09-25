import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Member } from 'src/members/entities/members.entity';
import { AuthJwtDecoded } from './dtos/auth-jwt-core';

abstract class CoreGuard implements CanActivate {
    private headers: Record<string, string>;

    async isAccessTokenValid() {
        try {
            const rawJwt = this.headers['x-jwt-decoded'];
            if (rawJwt) {
                const parsedJwt: AuthJwtDecoded = JSON.parse(rawJwt);
                if (parsedJwt.accessToken) {
                    return true;
                }
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
    validate(): Promise<boolean> {
        return this.isAccessTokenValid();
    }
}

@Injectable()
export class MemberGuard extends CoreGuard {
    validate(): Promise<boolean> {
        const promise = this.isAccessTokenValid() && this.isMemberValid();
        return promise;
    }
}
