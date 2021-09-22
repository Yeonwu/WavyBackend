import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthJwtDecoded } from './dtos/auth-jwt-core';

export const AuthJwt = createParamDecorator(
    (data: unknown, context: ExecutionContext): AuthJwtDecoded => {
        const req = context.switchToHttp().getRequest();
        return req.body.jwt;
    },
);
