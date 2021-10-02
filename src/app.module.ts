import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from '@nestjs/common';
import { MembersModule } from './members/members.module';
import { PracticesModule } from './practices/practices.module';
import { AnalysesModule } from './analyses/analyses.module';
import { RefVideosModule } from './ref-videos/ref-videos.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import * as Joi from 'joi';
import { Member } from './members/entities/members.entity';
import { Group, GroupDetail } from './common/entities/code.entity';
import { Analysis } from './analyses/entities/analyses.entity';
import { Practice } from './practices/entities/practice.entity';
import { MemberExpHistory } from './members/entities/mbr-exp-history.entity';
import { RefVideo } from './ref-videos/entities/ref-video.entity';
import { Tag } from './tags/entities/tag.entity';
import { TagsModule } from './tags/tags.module';
import { AuthModule } from './auth/auth.module';
import { JwtMiddleware } from './auth/auth-jwt.middleware';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { AwsModule } from './aws/aws.module';
import { AwsSdkModule } from 'nest-aws-sdk';
import { S3, S3Control, S3Outposts, SharedIniFileCredentials } from 'aws-sdk';
import { GetS3SignedUrlInput } from './aws/dtos/get-s3-signed-url.dto';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath:
                process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.dev',
            ignoreEnvFile: process.env.NODE_ENV === 'prod',
            validationSchema: Joi.object({
                NODE_ENV: Joi.string().valid('dev', 'test').required(),
                DB_HOST: Joi.string().required(),
                DB_PORT: Joi.string().required(),
                DB_USER: Joi.string().required(),
                DB_PW: Joi.string().required(),
                DB_NAME: Joi.string().required(),

                SYSTEM_MBR_SEQ: Joi.number().required(),

                SECRET_KEY: Joi.string().required(),

                KAKAO_CLIENT_ID: Joi.string().required(),
                KAKAO_LOGIN_HOST: Joi.string().required(),
                KAKAO_GRANT_TYPE: Joi.string().required(),
                BASE_DOMAIN: Joi.string().required(),

                AWS_PROFILE: Joi.string().required(),
                AWS_PRIVATE_KEY_LOCATION: Joi.string().required(),
                AWS_UPLOAD_S3_BUCKET: Joi.string().required(),
            }),
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            username: process.env.DB_USER,
            password: process.env.DB_PW,
            database: process.env.DB_NAME,
            synchronize: process.env.NODE_ENV !== 'prod',
            logging: process.env.NODE_ENV !== 'prod',
            entities: [
                Member,
                MemberExpHistory,
                Group,
                GroupDetail,
                Analysis,
                Practice,
                RefVideo,
                Tag,
            ],
        }),
        AwsSdkModule.forRoot({
            defaultServiceOptions: {
                region: process.env.AWS_REGOIN,
                credentials: new SharedIniFileCredentials({
                    profile: process.env.AWS_PROFILE,
                }),
            },
            services: [S3],
        }),
        MembersModule,
        PracticesModule,
        AnalysesModule,
        RefVideosModule,
        CommonModule,
        TagsModule,
        AuthModule,
        BookmarksModule,
        AwsModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(JwtMiddleware).forRoutes({
            path: '*',
            method: RequestMethod.ALL,
        });
    }
}
