import {
    forwardRef,
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtMiddleware } from 'src/auth/auth-jwt.middleware';
import { AuthModule } from 'src/auth/auth.module';
import { Member } from './entities/members.entity';
import { MbrStaticsSerivce } from './mbr-statics.service';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Member]),
        ConfigModule,
        forwardRef(() => AuthModule),
    ],
    controllers: [MembersController],
    providers: [MembersService, MbrStaticsSerivce],
    exports: [MembersService],
})
export class MembersModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(JwtMiddleware).forRoutes({
            path: '/members/signup',
            method: RequestMethod.ALL,
        });
    }
}
