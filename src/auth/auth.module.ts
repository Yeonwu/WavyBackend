import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from 'src/members/entities/members.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Member])],
    providers: [AuthService],
    controllers: [AuthController],
})
export class AuthModule {}
