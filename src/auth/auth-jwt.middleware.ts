import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { MembersService } from 'src/members/members.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
    constructor(
        private readonly jwtService: JwtService,
        private readonly memberService: MembersService,
    ) {}
    async use(req: Request, res: Response, next: NextFunction) {
        try {
            if ('x-jwt' in req.headers) {
                const token = req.headers['x-jwt'].toString();
                const decoded = this.jwtService.verify(token);

                if (
                    typeof decoded === 'object' &&
                    decoded.hasOwnProperty('mbrSeq')
                ) {
                    const member = await this.memberService.getMemberBySeq(
                        decoded.mbrSeq,
                    );

                    req.body.member = member;
                    req.body.accessToken = decoded.accessToken;
                }
            }
        } catch (error) {
            console.log(error.message);
            req.body.member = null;
            req.body.accessToken = null;
        } finally {
            next();
        }
    }
}
