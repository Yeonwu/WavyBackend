import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtMiddleware } from 'src/auth/auth-jwt.middleware';
import { AuthModule } from 'src/auth/auth.module';
import { UserVideoS3Service } from 'src/aws/aws-user-video.service';
import { AwsModule } from 'src/aws/aws.module';
import { MembersModule } from 'src/members/members.module';
import { RefVideosModule } from 'src/ref-videos/ref-videos.module';
import { AnalysesController } from './analyses.controller';
import { AnalysesService } from './analyses.service';
import { Analysis } from './entities/analyses.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Analysis]),
        AuthModule,
        MembersModule,
        RefVideosModule,
        AwsModule,
    ],
    controllers: [AnalysesController],
    providers: [AnalysesService, UserVideoS3Service],
})
export class AnalysesModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(JwtMiddleware).forRoutes({
            path: '/analyses',
            method: RequestMethod.ALL,
        });
    }
}
