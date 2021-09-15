import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
} from '@nestjs/common';
import {
    CreateMemberInput,
    CreateMemberOutput,
} from './dtos/create-member.dto';
import { DeleteMemberOutput } from './dtos/delete-member.dto';
import { ReadMemberOutput } from './dtos/read-member.dto';
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
            return this.membersSerivce.createMember(createMemberInput);
        } catch (error) {
            console.error(error.message);
            return {
                success: false,
                error: '회원 생성에 실패했습니다.',
            };
        }
    }

    @Get(':id')
    @ApiResponse({
        status: 200,
        description: '회원정보 조회',
        type: ReadMemberOutput,
    })
    readMember(@Param() params): ReadMemberOutput {
        return { success: true };
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
        return { success: true };
    }

    @Delete(':id')
    @ApiResponse({
        status: 200,
        description: '회원 탈퇴',
        type: DeleteMemberOutput,
    })
    deleteMember(@Param() params): DeleteMemberOutput {
        return { success: true };
    }

    @Get(':id/statics')
    @ApiResponse({
        status: 200,
        description: '회원 통계 조회',
        type: ReadStaticsOuput,
    })
    readStatics(@Param() params): ReadStaticsOuput {
        return { success: true };
    }
}
