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
import {
    getLoggedInMemberOutput,
    GetMemberOutput,
} from './dtos/get-member.dto';
import {
    GetStaticsInput,
    GetStaticsOptions,
    GetStaticsOuput,
} from './dtos/get-statics.dto';
import {
    UpdateMemberInput,
    UpdateMemberOutput,
} from './dtos/update-member.dto';
import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiQuery,
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

    @ApiOperation({
        summary: '회원 경험치 이력 조회',
        description: '최신 회원 경험치 이력을 불러옵니다.',
    })
    @ApiResponse({
        status: 200,
        description: '최신 회원 경험치 이력을 불러옵니다.',
        type: GetMbrExpHistoryOutput,
    })
    @Get('exp')
    @UseGuards(MemberGuard)
    async getExpHistory(
        @AuthMember() member: Member,
    ): Promise<GetMbrExpHistoryOutput> {
        return this.mbrExpHistoriesService.getExpHistory(member.mbrSeq);
    }

    @UseGuards(AccessTokenGuard)
    @ApiOperation({
        summary: '회원 등록',
        description: '회원 가입시 호출하여 회원 정보를 등록합니다.',
    })
    @ApiCreatedResponse({
        description: '회원을 등록하고 등록한 정보를 불러옵니다.',
        type: CreateMemberOutput,
    })
    @Post('signup')
    async createMember(
        @Body() createMemberInput: CreateMemberInput,
        @AuthJwt() jwt: AuthJwtDecoded,
    ): Promise<CreateMemberOutput> {
        return await this.membersSerivce.createMember(createMemberInput, jwt);
    }

    @ApiOperation({
        summary: '로그인한 유저 정보 조회',
        description: '로그인한 유저의 정보를 불러옵니다.',
    })
    @ApiOkResponse({
        description: '로그인한 유저의 정보를 불러옵니다.',
        type: getLoggedInMemberOutput,
    })
    @Get('me')
    @UseGuards(MemberGuard)
    getLoggedInMember(@AuthMember() member: Member): getLoggedInMemberOutput {
        return this.membersSerivce.getLoggedInMember(member);
    }

    @ApiOperation({
        summary: '회원 정보 조회',
        description: '회원 일련번호를 통해 해당 회원의 정보를 불러옵니다.',
    })
    @Get(':id')
    @UseGuards(MemberGuard)
    @ApiOkResponse({
        description: '회원 정보를 조회합니다.',
        type: GetMemberOutput,
    })
    async getMemberByID(@Param('id') id: string): Promise<GetMemberOutput> {
        return await this.membersSerivce.getMemberBySeq(id);
    }

    @ApiOperation({
        summary: '회원정보 수정',
        description: '로그인한 회원의 정보를 수정합니다.',
    })
    @ApiOkResponse({
        description: '회원정보를 수정합니다.',
        type: UpdateMemberOutput,
    })
    @Put()
    @UseGuards(MemberGuard)
    async updateMember(
        @AuthMember() member: Member,
        @Body() updateMemberInput: UpdateMemberInput,
    ): Promise<UpdateMemberOutput> {
        return await this.membersSerivce.updateMember(
            member.mbrSeq,
            updateMemberInput,
        );
    }

    @ApiOperation({
        summary: '회원 탈퇴',
        description: '로그인한 회원의 정보를 삭제하고 탈퇴합니다.',
    })
    @ApiOkResponse({
        description: '회원 정보를 삭제하고 탈퇴합니다. ',
        type: DeleteMemberOutput,
    })
    @Delete()
    @UseGuards(MemberGuard)
    async deleteMember(
        @AuthMember() member: Member,
    ): Promise<DeleteMemberOutput> {
        return await this.membersSerivce.deleteMember(member.mbrSeq);
    }

    @ApiOperation({
        summary: '회원 통계 조회',
        description: '회원의 통계 정보를 불러옵니다.',
    })
    @ApiOkResponse({
        description: '회원 통계 정보를 불러옵니다.',
        type: GetStaticsOuput,
    })
    @ApiQuery({ type: GetStaticsInput })
    @Get(':id/statics')
    @UseGuards(MemberGuard)
    async getStatics(
        @Param('id') id: string,
        @AuthMember() member: Member,
        @Query() getStaticsInput: GetStaticsInput,
    ): Promise<GetStaticsOuput> {
        const options: GetStaticsOptions = {
            dancesGoodAtLimit: getStaticsInput?.dancegoodlimit,
            dancesOftenLimit: getStaticsInput?.danceoftenlimit,
        };
        return await this.mbrStaticsService.getStatics(
            id,
            member.mbrSeq,
            options,
        );
    }
}
