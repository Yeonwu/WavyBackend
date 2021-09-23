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
import { AuthJwt } from 'src/auth/auth-jwt.decorator';
import { AuthMember } from 'src/auth/auth-member.decorator';
import { Member } from './entities/members.entity';

@Controller('members')
export class MembersController {
    constructor(
        private readonly membersSerivce: MembersService,
        private readonly mbrStaticsService: MbrStaticsSerivce,
    ) {}
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
