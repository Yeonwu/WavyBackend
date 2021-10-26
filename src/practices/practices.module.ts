import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Practice } from './entities/practice.entity';
import { PracticesController } from './practices.controller';
import { PracticesService } from './practices.service';

@Module({
    imports: [TypeOrmModule.forFeature([Practice])],
    controllers: [PracticesController],
    providers: [PracticesService],
})
export class PracticesModule {}
