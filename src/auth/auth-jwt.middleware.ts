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

                if (typeof decoded === 'object') {
                    req.body.jwt = decoded;
                    if (decoded.hasOwnProperty('mbrSeq')) {
                        const { ok, member } =
                            await this.memberService.getMemberBySeq(
                                decoded.mbrSeq,
                            );

                        if (!ok) {
                            throw new Error(
                                `From JwtMiddleWare: Cannot find Member by mbrSeq(${decoded.mbrSeq}).`,
                            );
                        }
                        req.body.member = member;
                    }
                }
            }
        } catch (error) {
            console.log(`From JwtMiddleWare: ${error.message}`);
            req.body.member = req.body.member ?? null;
            req.body.jwt = req.body.jwt ?? null;
        } finally {
            next();
        }
    }
}
