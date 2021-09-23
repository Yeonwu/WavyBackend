import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Member } from 'src/members/entities/members.entity';

export const AuthMember = createParamDecorator(
    (data: unknown, context: ExecutionContext): Member => {
        const req = context.switchToHttp().getRequest();
        return JSON.parse(req.headers['x-member']);
    },
);
