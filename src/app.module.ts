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
import { Lambda, S3, SharedIniFileCredentials } from 'aws-sdk';

const getEnvFilePath = (node_env: string): string => {
    if (node_env === 'dev') {
        return '.env.dev';
    } else if (node_env === 'test') {
        return '.env.test';
    } else if (node_env === 'prod') {
        return '.env.prod';
    } else {
        return '.env.dev';
    }
};

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: getEnvFilePath(process.env.NODE_ENV),
            validationSchema: Joi.object({
                NODE_ENV: Joi.string().valid('dev', 'test', 'prod').required(),

                DB_HOST: Joi.string().required(),
                DB_PORT: Joi.string().required(),
                DB_USER: Joi.string().required(),
                DB_PW: Joi.string().required(),
                DB_NAME: Joi.string().required(),

                SECRET_KEY: Joi.string().required(),

                SYSTEM_MBR_SEQ: Joi.number().required(),

                KAKAO_LOGIN_HOST: Joi.string().required(),
                KAKAO_LOGOUT_HOST: Joi.string().required(),
                KAKAO_CLIENT_ID: Joi.string().required(),
                KAKAO_GRANT_TYPE: Joi.string().required(),

                AWS_REGION: Joi.string().required(),
                AWS_PROFILE: Joi.string().required(),
                AWS_PRIVATE_KEY_LOCATION: Joi.string().required(),

                AWS_USER_VIDEO_UPLOAD_S3_BUCKET: Joi.string().required(),
                AWS_USER_VIDEO_CF_ENDPOINT: Joi.string().required(),
                AWS_USER_VIDEO_CONVERTED_BUCKET: Joi.string().required(),

                AWS_USER_IMAGE_S3_BUCKET: Joi.string().required(),
                DEFAULT_USER_IMAGE: Joi.string().required(),

                AWS_AN_JSON_BUCKET_ENDPOINT: Joi.string().required(),
                AWS_EXT_JSON_BUCKET_ENDPOINT: Joi.string().required(),

                CORS_ORIGINS: Joi.string().required(),
                CORS_HEADERS: Joi.string().required(),
                CORS_METHODS: Joi.string().required(),

                USER_VIDEO_ANALYST_REQ_URL: Joi.string().required(),
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
        TypeOrmModule.forFeature([Member]),
        AwsSdkModule.forRoot({
            defaultServiceOptions: {
                region: process.env.AWS_REGOIN,
                credentials: new SharedIniFileCredentials({
                    profile: process.env.AWS_PROFILE,
                }),
                // TODO: convert mp4 Lambda to async...
                httpOptions: {
                    timeout: 300000,
                },
            },
            services: [S3, Lambda],
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
