import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from 'src/members/entities/members.entity';

@Module({
    imports: [
        JwtModule.register({ secret: 'testesteste' }),
        ConfigModule,
        TypeOrmModule.forFeature([Member]),
    ],
    providers: [AuthService],
    controllers: [AuthController],
})
export class AuthModule {}
