import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        if (context.switchToHttp().getRequest()?.member) {
            return true;
        }
        return false;
    }
}
