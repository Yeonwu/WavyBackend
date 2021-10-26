import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthJwtDecoded } from './dtos/auth-jwt-core';

export const AuthJwt = createParamDecorator(
    (data: unknown, context: ExecutionContext): AuthJwtDecoded => {
        const req = context.switchToHttp().getRequest();
        return JSON.parse(req.headers['x-jwt-decoded']);
    },
);

export const RawJwt = createParamDecorator(
    (data: unknown, context: ExecutionContext): AuthJwtDecoded => {
        const req = context.switchToHttp().getRequest();
        return req.headers['authorization'];
    },
);
