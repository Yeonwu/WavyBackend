import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from 'src/members/entities/members.entity';
import { RefVideo } from 'src/ref-videos/entities/ref-video.entity';
import { BookmarksController } from './bookmarks.controller';
import { BookmarksService } from './bookmarks.service';

@Module({
    imports: [TypeOrmModule.forFeature([Member, RefVideo])],
    controllers: [BookmarksController],
    providers: [BookmarksService],
})
export class BookmarksModule {}
