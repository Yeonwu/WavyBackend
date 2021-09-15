import { Module } from '@nestjs/common';
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
import { BookmarksModule } from './bookmarks/bookmarks.module';

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
                PRIVATE_KEY: Joi.string().required(),
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
                MemberRefVideo,
                MemberExpHistory,
                Group,
                GroupDetail,
                Analysis,
                Practice,
                RefVideo,
                Tag,
            ],
        }),
        MembersModule,
        PracticesModule,
        AnalysesModule,
        RefVideosModule,
        CommonModule,
        TagsModule,
        BookmarksModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
