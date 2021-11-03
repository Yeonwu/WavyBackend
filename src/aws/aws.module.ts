import { Module } from '@nestjs/common';
import { AwsService } from './aws.service';
import { AwsController } from './aws.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Analysis } from 'src/analyses/entities/analyses.entity';
import { UserImageS3Service } from './aws-user-image.service';
import { UserVideoS3Service } from './aws-user-video.service';
import { StartMLInstanceInterceptor } from './aws-ml-instance.interceptor';

@Module({
    imports: [TypeOrmModule.forFeature([Analysis])],
    providers: [
        AwsService,
        UserVideoS3Service,
        UserImageS3Service,
        StartMLInstanceInterceptor,
    ],
    controllers: [AwsController],
    exports: [
        AwsService,
        UserVideoS3Service,
        UserImageS3Service,
        StartMLInstanceInterceptor,
    ],
})
export class AwsModule {}
