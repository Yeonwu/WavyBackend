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
        return await this.membersSerivce.createMember(createMemberInput);
    }

    @Get(':id')
    @ApiResponse({
        status: 200,
        description: '회원정보 조회 API',
        type: GetMemberOutput,
    })
    async getMemberByID(@Param('id') id: number): Promise<GetMemberOutput> {
        return await this.membersSerivce.getMemberBySeq(id);
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
        return await this.membersSerivce.updateMember(id, updateMemberInput);
    }

    @Delete(':id')
    @ApiResponse({
        status: 200,
        description: '회원 탈퇴 API',
        type: DeleteMemberOutput,
    })
    async deleteMember(@Param('id') id: number): Promise<DeleteMemberOutput> {
        return await this.membersSerivce.deleteMember(id);
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
        return await this.mbrStaticsService.getStatics(id, {
            dancesGoodAtLimit: dancesGoodAtLimit || null,
            dancesOftenLimit: dancesOftenLimit || null,
        });
    }
}
