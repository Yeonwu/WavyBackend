import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AccessTokenGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        try {
            const ACCESS_TOKEN_EXISTS = context.switchToHttp().getRequest().body
                ?.jwt?.accessToken;

            if (ACCESS_TOKEN_EXISTS) {
                return true;
            }
            return false;
        } catch (error) {
            console.log(`From AccessTokenGuard: ${error.message}`);
            return false;
        }
    }
}

@Injectable()
export class MemberGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        try {
            const MEMBER_EXISTS = context.switchToHttp().getRequest()
                .body?.member;
            const ACCESS_TOKEN_EXISTS = context.switchToHttp().getRequest().body
                ?.jwt?.accessToken;

            if (MEMBER_EXISTS && ACCESS_TOKEN_EXISTS) {
                return true;
            }
            return false;
        } catch (error) {
            console.log(`From MemberGuard: ${error.message}`);
            return false;
        }
    }
}
