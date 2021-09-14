import { Module } from '@nestjs/common';
import { MembersController } from './members.controller';

@Module({
    controllers: [MembersController],
})
export class MembersModule {}
