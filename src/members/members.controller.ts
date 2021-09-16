import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import {
    CreateMemberInput,
    CreateMemberOutput,
} from './dtos/create-member.dto';
import { DeleteMemberOutput } from './dtos/delete-member.dto';
import { GetMemberOutput } from './dtos/get-member.dto';
import { GetStaticsOuput } from './dtos/get-statics.dto';
import {
    UpdateMemberInput,
    UpdateMemberOutput,
} from './dtos/update-member.dto';
import { ApiCreatedResponse, ApiResponse } from '@nestjs/swagger';
import { MembersService } from './members.service';
import { MbrStaticsSerivce } from './mbr-statics.service';

@Controller('members')
export class MembersController {
    constructor(
        private readonly membersSerivce: MembersService,
        private readonly mbrStaticsService: MbrStaticsSerivce,
    ) {}
    @Post('signup')
    @ApiCreatedResponse({
        description: '회원가입 API',
        type: CreateMemberOutput,
    })
    async createMember(
        @Body() createMemberInput: CreateMemberInput,
    ): Promise<CreateMemberOutput> {
        try {
            await this.membersSerivce.createMember(createMemberInput);
            return { ok: true };
        } catch (error) {
            throw new HttpException(
                '회원등록에 실패했습니다.',
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    @Get(':id')
    @ApiResponse({
        status: 200,
        description: '회원정보 조회 API',
        type: GetMemberOutput,
    })
    async getMemberByID(@Param('id') id: number): Promise<GetMemberOutput> {
        try {
            const member = await this.membersSerivce.getMemberBySeq(id);
            return { ok: true, member };
        } catch (error) {
            // 센트리 / 뉴렐릭 => 유료, 무료.
            // 500에러 & 정돈된 에러 메세지 | 홈으로 이동 등등...
            // 로그 남기기.
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException(
                    '회원 조회에 실패했습니다.',
                    HttpStatus.BAD_REQUEST,
                );
            }
        }
    }

    @Put(':id')
    @ApiResponse({
        status: 200,
        description: '회원정보 수정 API',
        type: UpdateMemberOutput,
    })
    async updateMember(
        @Param('id') id: number,
        @Body() updateMemberInput: UpdateMemberInput,
    ): Promise<UpdateMemberOutput> {
        try {
            await this.membersSerivce.updateMember(id, updateMemberInput);
            return { ok: true };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException(
                    '회원 정보 수정에 실패했습니다.',
                    HttpStatus.BAD_REQUEST,
                );
            }
        }
    }

    @Delete(':id')
    @ApiResponse({
        status: 200,
        description: '회원 탈퇴 API',
        type: DeleteMemberOutput,
    })
    async deleteMember(@Param('id') id: number): Promise<DeleteMemberOutput> {
        try {
            return await this.membersSerivce.deleteMember(id);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException(
                    '회원 탈퇴에 실패했습니다.',
                    HttpStatus.BAD_REQUEST,
                );
            }
        }
    }

    @Get(':id/statics')
    @ApiResponse({
        status: 200,
        description: '회원 통계 조회 API',
        type: GetStaticsOuput,
    })
    async getStatics(
        @Param('id') id: number,
        @Query('dancegoodlimit') dancesGoodAtLimit?: number,
        @Query('danceoftenlimit') dancesOftenLimit?: number,
    ): Promise<GetStaticsOuput> {
        try {
            return await this.mbrStaticsService.getStatics(id, {
                dancesGoodAtLimit: dancesGoodAtLimit || null,
                dancesOftenLimit: dancesOftenLimit || null,
            });
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException(
                    '회원 통계 조회에 실패했습니다.',
                    HttpStatus.BAD_REQUEST,
                );
            }
        }
    }
}
