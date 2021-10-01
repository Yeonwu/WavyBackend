import { Module } from '@nestjs/common';
import { AwsService } from './aws.service';
import { AwsController } from './aws.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Analysis } from 'src/analyses/entities/analyses.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Analysis])],
    providers: [AwsService],
    controllers: [AwsController],
    exports: [AwsService],
})
export class AwsModule {}
