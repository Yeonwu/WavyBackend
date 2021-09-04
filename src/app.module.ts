import { Module } from '@nestjs/common';
import { MembersModule } from './members/members.module';
import { PracticesModule } from './practices/practices.module';
import { AnalysesModule } from './analyses/analyses.module';
import { RefVideoesModule } from './ref-videoes/ref-videoes.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import * as Joi from 'joi';
import { Member } from './members/entities/members.entity';
import { Group, GroupDetail } from './common/entities/code.entity';
import { Practice } from './practices/entities/practice.entity';
import { RefVideo } from './ref-videoes/entities/ref-video.entity';

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
            entities: [Member, Group, GroupDetail, Practice, RefVideo],
        }),
        MembersModule,
        PracticesModule,
        AnalysesModule,
        RefVideoesModule,
        CommonModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
