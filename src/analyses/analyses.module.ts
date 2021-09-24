import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtMiddleware } from 'src/auth/auth-jwt.middleware';
import { AuthModule } from 'src/auth/auth.module';
import { MembersModule } from 'src/members/members.module';
import { AnalysesController } from './analyses.controller';
import { AnalysesService } from './analyses.service';
import { Analysis } from './entities/analyses.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Analysis]), AuthModule, MembersModule],
    controllers: [AnalysesController],
    providers: [AnalysesService],
})
export class AnalysesModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(JwtMiddleware).forRoutes({
            path: '/analyses',
            method: RequestMethod.ALL,
        });
    }
}
