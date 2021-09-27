import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    Req,
    UseGuards,
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
import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { MembersService } from './members.service';
import { MbrStaticsSerivce } from './mbr-statics.service';
import { AccessTokenGuard, MemberGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { AuthJwtDecoded } from 'src/auth/dtos/auth-jwt-core';
import {
    CreateMbrExpHistoryInput,
    CreateMbrExpHistoryOutput,
} from './dtos/create-mbr-exp-history';
import { GetMbrExpHistoryOutput } from './dtos/get-mbr-exp-history';
import { MbrExpHistoriesService } from './mbr-exp-histories.service';
import { Member } from './entities/members.entity';
import { AuthMember } from 'src/auth/auth-member.decorator';
import { AuthJwt } from 'src/auth/auth-jwt.decorator';

@ApiTags('회원')
@ApiBearerAuth('access-token')
@Controller('members')
export class MembersController {
    constructor(
        private readonly membersSerivce: MembersService,
        private readonly mbrStaticsService: MbrStaticsSerivce,
        private readonly mbrExpHistoriesService: MbrExpHistoriesService,
    ) {}

    @ApiOperation({
        summary: '회원 경험치 등록',
        description:
            '회원이 경험치를 획득했을 경우 호출하여 회원 경험치를 등록합니다.',
    })
    @ApiResponse({
        status: 201,
        description:
            '회원 경험치를 등록하고, 갱신된 회원 경험치 이력을 불러옵니다.',
        type: CreateMbrExpHistoryOutput,
    })
    @Post('exp')
    @UseGuards(MemberGuard)
    async createExpHistory(
        @Body() expHistoryInput: CreateMbrExpHistoryInput,
        @AuthMember() member: Member,
    ): Promise<CreateMbrExpHistoryOutput> {
        return this.mbrExpHistoriesService.createExpHistory(
            expHistoryInput,
            member,
        );
    }

    @Get('exp')
    @ApiOperation({
        summary: '회원 경험치 이력 조회',
        description: '최신 회원 경험치 이력을 불러옵니다.',
    })
    @ApiResponse({
        status: 200,
        description: '최신 회원 경험치 이력을 불러옵니다.',
        type: GetMbrExpHistoryOutput,
    })
    @UseGuards(MemberGuard)
    async getExpHistory(
        @AuthMember() member: Member,
    ): Promise<GetMbrExpHistoryOutput> {
        return this.mbrExpHistoriesService.getExpHistory(member.mbrSeq);
    }

    @Post('signup')
    @UseGuards(AccessTokenGuard)
    @ApiCreatedResponse({
        description: '회원가입 API',
        type: CreateMemberOutput,
    })
    async createMember(
        @Body('member') createMemberInput: CreateMemberInput,
        @AuthJwt() jwt: AuthJwtDecoded,
    ): Promise<CreateMemberOutput> {
        return await this.membersSerivce.createMember(createMemberInput, jwt);
    }

    @Get('me')
    @UseGuards(MemberGuard)
    getLoggedInMember(@AuthMember() member: Member) {
        return this.membersSerivce.getLoggedInMember(member);
    }

    @Get(':id')
    @UseGuards(MemberGuard)
    @ApiResponse({
        status: 200,
        description: '회원정보 조회 API',
        type: GetMemberOutput,
    })
    async getMemberByID(@Param('id') id: string): Promise<GetMemberOutput> {
        return await this.membersSerivce.getMemberBySeq(id);
    }

    @Put()
    @UseGuards(MemberGuard)
    @ApiResponse({
        status: 200,
        description: '회원정보 수정 API',
        type: UpdateMemberOutput,
    })
    async updateMember(
        @AuthMember() member: Member,
        @Body() updateMemberInput: UpdateMemberInput,
    ): Promise<UpdateMemberOutput> {
        return await this.membersSerivce.updateMember(
            member.mbrSeq,
            updateMemberInput,
        );
    }

    @Delete()
    @ApiResponse({
        status: 200,
        description: '회원 탈퇴 API',
        type: DeleteMemberOutput,
    })
    @UseGuards(MemberGuard)
    async deleteMember(
        @AuthMember() member: Member,
    ): Promise<DeleteMemberOutput> {
        return await this.membersSerivce.deleteMember(member.mbrSeq);
    }

    @Get(':id/statics')
    @UseGuards(MemberGuard)
    @ApiResponse({
        status: 200,
        description: '회원 통계 조회 API',
        type: GetStaticsOuput,
    })
    async getStatics(
        @Param('id') id: string,
        @AuthMember() member: Member,
        @Query('dancegoodlimit') dancesGoodAtLimit?: number,
        @Query('danceoftenlimit') dancesOftenLimit?: number,
    ): Promise<GetStaticsOuput> {
        return await this.mbrStaticsService.getStatics(id, member.mbrSeq, {
            dancesGoodAtLimit: dancesGoodAtLimit || null,
            dancesOftenLimit: dancesOftenLimit || null,
        });
    }
}
