import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefVideo } from './entities/ref-video.entity';
import { RefVideosController } from './ref-videos.controller';
import { RefVideosService } from './ref-videos.service';

@Module({
    imports: [TypeOrmModule.forFeature([RefVideo])],
    controllers: [RefVideosController],
    providers: [RefVideosService],
})
export class RefVideosModule {}
