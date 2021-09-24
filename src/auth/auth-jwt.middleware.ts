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
            if ('authorization' in req.headers) {
                const token = req.headers['authorization']
                    .toString()
                    .split(' ')[1];
                const decoded = this.jwtService.verify(token);

                if (typeof decoded === 'object') {
                    req.headers['x-jwt-decoded'] = JSON.stringify(decoded);
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
                        req.headers['x-member'] = JSON.stringify(member);
                    }
                }
            }
        } catch (error) {
            console.log(`From JwtMiddleWare: ${error.message}`);
            req.headers['x-jwt-decoded'] = req.headers['x-jwt-decoded'] ?? null;
            req.headers['x-member'] = req.headers['x-member'] ?? null;
        } finally {
            next();
        }
    }
}
