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
import { AwsModule } from 'src/aws/aws.module';
import { MemberExpHistory } from './entities/mbr-exp-history.entity';
import { Member } from './entities/members.entity';
import { MbrExpHistoriesService } from './mbr-exp-histories.service';
import { MbrStaticsSerivce } from './mbr-statics.service';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Member, MemberExpHistory]),
        ConfigModule,
        forwardRef(() => AuthModule),
        AwsModule,
    ],
    controllers: [MembersController],
    providers: [MembersService, MbrStaticsSerivce, MbrExpHistoriesService],
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
