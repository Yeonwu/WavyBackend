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
import { ApiCreatedResponse, ApiResponse } from '@nestjs/swagger';
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

@Controller('members')
export class MembersController {
    constructor(
        private readonly membersSerivce: MembersService,
        private readonly mbrStaticsService: MbrStaticsSerivce,
        private readonly mbrExpHistoriesService: MbrExpHistoriesService,
    ) {}

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
        @Body('jwt') jwt: AuthJwtDecoded,
    ): Promise<CreateMemberOutput> {
        return await this.membersSerivce.createMember(createMemberInput, jwt);
    }

    @Get(':id')
    @ApiResponse({
        status: 200,
        description: '회원정보 조회 API',
        type: GetMemberOutput,
    })
    async getMemberByID(@Param('id') id: string): Promise<GetMemberOutput> {
        return await this.membersSerivce.getMemberBySeq(id);
    }

    @Put(':id')
    @ApiResponse({
        status: 200,
        description: '회원정보 수정 API',
        type: UpdateMemberOutput,
    })
    async updateMember(
        @Param('id') id: string,
        @Body() updateMemberInput: UpdateMemberInput,
    ): Promise<UpdateMemberOutput> {
        return await this.membersSerivce.updateMember(id, updateMemberInput);
    }

    @Delete(':id')
    @ApiResponse({
        status: 200,
        description: '회원 탈퇴 API',
        type: DeleteMemberOutput,
    })
    async deleteMember(@Param('id') id: string): Promise<DeleteMemberOutput> {
        return await this.membersSerivce.deleteMember(id);
    }

    @Get(':id/statics')
    @ApiResponse({
        status: 200,
        description: '회원 통계 조회 API',
        type: GetStaticsOuput,
    })
    async getStatics(
        @Param('id') id: string,
        @Query('dancegoodlimit') dancesGoodAtLimit?: number,
        @Query('danceoftenlimit') dancesOftenLimit?: number,
    ): Promise<GetStaticsOuput> {
        return await this.mbrStaticsService.getStatics(id, {
            dancesGoodAtLimit: dancesGoodAtLimit || null,
            dancesOftenLimit: dancesOftenLimit || null,
        });
    }
}
