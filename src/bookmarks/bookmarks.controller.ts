import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { BookmarksInput, BookmarksOutput } from './dtos/bookmarks.dto';
import {
    CreateBookmarkInput,
    CreateBookmarkOutput,
} from './dtos/create-bookmark.dto';
import {
    DeleteBookmarkInput,
    DeleteBookmarkOutput,
} from './dtos/delete-bookmark.dto';

@Controller('bookmarks')
export class BookmarksController {
    constructor(private readonly bookmarksService: BookmarksService) {}
    @Get()
    getBookmarks(
        @Body() bookmarksInput: BookmarksInput,
    ): Promise<BookmarksOutput> {
        // TODO: authMember를 인자로 받아야함
        const authMember = null;
        return this.bookmarksService.allBookmarks(authMember, bookmarksInput);
    }

    @Post()
    postBookmark(
        @Body() createBookmarkInput: CreateBookmarkInput,
    ): Promise<CreateBookmarkOutput> {
        // TODO: authMember를 인자로 받아야함
        const authMember = null;
        return this.bookmarksService.createBookmark(
            authMember,
            createBookmarkInput,
        );
    }

    @Delete()
    deleteBookmark(
        @Body() deleteBookmarkInput: DeleteBookmarkInput,
    ): Promise<DeleteBookmarkOutput> {
        // TODO: authMember를 인자로 받아야함
        const authMember = null;
        return this.bookmarksService.deleteBookmark(
            authMember,
            deleteBookmarkInput,
        );
    }
}
