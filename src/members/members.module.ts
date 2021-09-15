import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './entities/members.entity';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';

@Module({
    imports: [TypeOrmModule.forFeature([Member]), ConfigModule],
    controllers: [MembersController],
    providers: [MembersService],
})
export class MembersModule {}
