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
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from 'src/members/entities/members.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Member]),
        forwardRef(() => MembersModule),
    ],
    providers: [AuthService],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}
