import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import {
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
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
@ApiTags('보관')
@Controller('bookmarks')
export class BookmarksController {
    constructor(private readonly bookmarksService: BookmarksService) {}

    @ApiOperation({
        summary: '보관된 학습용 영상 목록 조회',
        description: '보관된 학습용 영상 목록을 가져온다',
    })
    @ApiOkResponse({
        description: '보관된 학습용 영상 목록을 가져온다',
        type: BookmarksOutput,
    })
    @Get()
    getBookmarks(
        @Body() bookmarksInput: BookmarksInput,
    ): Promise<BookmarksOutput> {
        // TODO: authMember를 인자로 받아야함
        const authMember = null;
        return this.bookmarksService.allBookmarks(authMember, bookmarksInput);
    }

    @ApiOperation({
        summary: '학습용 영상 보관 등록',
        description: '학습용 영상을 보관하고 보관한 영상정보를 반환한다',
    })
    @ApiCreatedResponse({
        description: '학습용 영상을 보관하고 보관한 영상정보를 반환한다',
        type: CreateBookmarkOutput,
    })
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

    @ApiOperation({
        summary: '학습용 영상 보관 삭제',
        description: '학습용 영상 보관을 삭제한다',
    })
    @ApiOkResponse({
        description: '학습용 영상 보관을 삭제한다',
        type: DeleteBookmarkOutput,
    })
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
