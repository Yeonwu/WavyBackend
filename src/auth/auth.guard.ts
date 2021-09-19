import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        try {
            const MEMBER_EXISTS = context.switchToHttp().getRequest()
                .body?.member;
            const ACCESS_TOKEN_EXISTS = context.switchToHttp().getRequest()
                .body?.accessToken;

            if (MEMBER_EXISTS && ACCESS_TOKEN_EXISTS) {
                return true;
            }
            return false;
        } catch (error) {
            console.log(error.message);
            return false;
        }
    }
}
