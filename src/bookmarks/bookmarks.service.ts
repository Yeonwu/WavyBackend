import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as camelcaseKeys from 'camelcase-keys';
import { PaginationInput } from 'src/common/dtos/pagination.dto';
import { Member } from 'src/members/entities/members.entity';
import { RefVideo } from 'src/ref-videos/entities/ref-video.entity';
import { getRepository, Repository } from 'typeorm';
import { BookmarksInput, BookmarksOutput } from './dtos/bookmarks.dto';
import {
    CreateBookmarkInput,
    CreateBookmarkOutput,
} from './dtos/create-bookmark.dto';
import {
    DeleteBookmarkInput,
    DeleteBookmarkOutput,
} from './dtos/delete-bookmark.dto';

@Injectable()
export class BookmarksService {
    constructor(
        @InjectRepository(Member)
        private readonly members: Repository<Member>,
        @InjectRepository(RefVideo)
        private readonly refVideos: Repository<RefVideo>,
    ) {}

    async allBookmarks(
        authMember: Member,
        { page }: BookmarksInput,
    ): Promise<BookmarksOutput> {
        try {
            const sql = `
                SELECT * FROM ref_video
                JOIN (SELECT rv_seq FROM bookmarks
                WHERE mbr_seq = ${authMember ? authMember.mbrSeq : 1}) AS RVSEQ
                ON RVSEQ.rv_seq = ref_video.rv_seq
                LIMIT ${PaginationInput.take}
                OFFSET ${PaginationInput.skip(+page)}
            `;
            const sql2 = `
                SELECT COUNT(ref_video.rv_seq) AS totalresults FROM ref_video
                JOIN (SELECT rv_seq FROM bookmarks
                WHERE mbr_seq = ${authMember ? authMember.mbrSeq : 1}) AS RVSEQ
                ON RVSEQ.rv_seq = ref_video.rv_seq
            `;
            let sqlRawResults;
            let sql2RawResults;
            await this.refVideos.manager.connection.transaction(
                async (manager) => {
                    sqlRawResults = await manager.query(sql);
                    sql2RawResults = await manager.query(sql2);
                },
            );
            if (!sqlRawResults) {
                return {
                    ok: false,
                    error: '북마크를 찾을 수 없습니다',
                };
            }
            const bookmarkedRefVideos = camelcaseKeys(sqlRawResults);
            const { totalresults } = sql2RawResults[0];
            const totalPages = Math.ceil(totalresults / PaginationInput.take);
            return {
                ok: true,
                totalResults: +totalresults,
                totalPages,
                bookmarkedRefVideos,
            };
        } catch (error) {
            return {
                ok: false,
                error: '북마크를 찾을 수 없습니다',
            };
        }
    }

    async createBookmark(
        authMember: Member,
        { refVideoId }: CreateBookmarkInput,
    ): Promise<CreateBookmarkOutput> {
        try {
            const refVideo = await this.refVideos.findOne(refVideoId);
            if (!refVideo) {
                return {
                    ok: false,
                    error: '존재하지 않는 학습용 동영상입니다',
                };
            }
            // 임시 authMember
            const tempMember = getRepository(Member).create();
            tempMember.mbrEmail = 'example@gmail.com';
            tempMember.mbrNickname = 'example';
            tempMember.certificationMethodCode = 'NAVER';
            tempMember.privacyConsentCode = 'Y';
            tempMember.marketingConsentCode = 'Y';
            tempMember.videoOptionCode = 'MEDIUM';
            tempMember.creatorSeq = '1';
            tempMember.updaterSeq = '1';

            const sql = `
                SELECT COUNT(*) FROM bookmarks
                WHERE mbr_seq = ${199} AND rv_seq = ${refVideoId}
            `;
            const sqlRawResults = await this.members.query(sql);
            const { count } = sqlRawResults[0];
            if (count > 0) {
                return {
                    ok: false,
                    error: '이미 보관된 영상입니다',
                };
            }

            tempMember.bookmarkedRefVideos = [refVideo];
            // authMember.bookmarkedRefVideos = [refVideo];
            // await this.members.manager.save(authMember);
            await this.members.manager.save(tempMember);
            return {
                ok: true,
                bookmarkedRefVideo: refVideo,
            };
        } catch (error) {
            return {
                ok: false,
                error: '영상을 보관 할 수 없습니다',
            };
        }
    }

    async deleteBookmark(
        authMember: Member,
        { refVideoId }: DeleteBookmarkInput,
    ): Promise<DeleteBookmarkOutput> {
        try {
            const refVideo = await this.refVideos.findOne(refVideoId);
            if (!refVideo) {
                return {
                    ok: false,
                    error: '존재하지 않는 학습용 동영상입니다',
                };
            }
            const sql = `
                DELETE FROM bookmarks
                WHERE mbr_seq = ${authMember ? authMember.mbrSeq : 1} 
                AND rv_seq = ${refVideoId}
            `;
            const sqlRawResults = await this.members.query(sql);
            const count = sqlRawResults[1];
            if (count == 0) {
                return {
                    ok: false,
                    error: '보관을 취소 할 수 없습니다',
                };
            }
            return {
                ok: true,
            };
        } catch (error) {
            return {
                ok: false,
                error: '보관을 취소 할 수 없습니다',
            };
        }
    }
}
