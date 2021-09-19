import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './entities/members.entity';
import { MbrStaticsSerivce } from './mbr-statics.service';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';

@Module({
    imports: [TypeOrmModule.forFeature([Member]), ConfigModule],
    controllers: [MembersController],
    providers: [MembersService, MbrStaticsSerivce],
    exports: [MembersService],
})
export class MembersModule {}
