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
} from '@nestjs/common';
import {
    CreateMemberInput,
    CreateMemberOutput,
} from './dtos/create-member.dto';
import { DeleteMemberOutput } from './dtos/delete-member.dto';
import { GetMemberOutput } from './dtos/get-member.dto';
import { ReadStaticsOuput } from './dtos/read-statics.dto';
import {
    UpdateMemberInput,
    UpdateMemberOutput,
} from './dtos/update-member.dto';
import { ApiCreatedResponse, ApiResponse } from '@nestjs/swagger';
import { MembersService } from './members.service';

@Controller('members')
export class MembersController {
    constructor(private readonly membersSerivce: MembersService) {}
    @Post('signup')
    @ApiCreatedResponse({
        description: '회원가입',
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
        description: '회원정보 조회',
        type: GetMemberOutput,
    })
    async getMemberByID(@Param('id') id: number): Promise<GetMemberOutput> {
        try {
            const member = await this.membersSerivce.getMemberByID(id);
            return { ok: true, member };
        } catch (error) {
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
        description: '회원정보 수정',
        type: UpdateMemberOutput,
    })
    updateMember(
        @Param() params,
        @Body() updateMemberInput: UpdateMemberInput,
    ): UpdateMemberOutput {
        return { ok: true };
    }

    @Delete(':id')
    @ApiResponse({
        status: 200,
        description: '회원 탈퇴',
        type: DeleteMemberOutput,
    })
    deleteMember(@Param() params): DeleteMemberOutput {
        return { ok: true };
    }

    @Get(':id/statics')
    @ApiResponse({
        status: 200,
        description: '회원 통계 조회',
        type: ReadStaticsOuput,
    })
    readStatics(@Param() params): ReadStaticsOuput {
        return { ok: true };
    }
}
