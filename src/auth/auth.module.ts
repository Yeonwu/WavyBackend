import {
    forwardRef,
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MembersModule } from 'src/members/members.module';
import { JwtMiddleware } from './auth-jwt.middleware';

@Module({
    imports: [forwardRef(() => MembersModule)],
    providers: [AuthService],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(JwtMiddleware).forRoutes({
            path: '/auth/kakaoLogout',
            method: RequestMethod.GET,
        });
    }
}
