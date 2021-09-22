import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiSecurity,
    ApiTags,
} from '@nestjs/swagger';
import { AuthMember } from 'src/auth/auth-member.decorator';
import { MemberGuard } from 'src/auth/auth.guard';
import { Member } from 'src/members/entities/members.entity';
import {
    CreatePracticeInput,
    CreatePracticeOutput,
} from './dtos/create-practice.dto';
import { PracticesTodaySumOutput } from './dtos/practices-today-sum.dto';
import { PracticesService } from './practices.service';

@ApiTags('연습')
@ApiSecurity('Authorization')
@Controller('practices')
export class PracticesController {
    constructor(private readonly practicesService: PracticesService) {}

    @ApiOperation({
        summary: '금일 누적 연습시간 조회',
        description: '하룻동안 누적된 연습시간을 조회한 결과를 가져온다',
    })
    @ApiOkResponse({
        description: '하룻동안 누적된 연습시간을 조회한 결과를 가져온다',
        type: PracticesTodaySumOutput,
    })
    @Get('/today/sum')
    @UseGuards(MemberGuard)
    getPracticesTodaySum(
        @AuthMember() authMember: Member,
    ): Promise<PracticesTodaySumOutput> {
        return this.practicesService.allPraticesTodaySum(authMember);
    }

    @ApiOperation({
        summary: '연습시간 저장',
        description: '연습시간을 저장하고 저장한 내용을 보여줍니다',
    })
    @ApiCreatedResponse({
        description: '연습시간을 저장하고 저장한 내용을 보여줍니다',
        type: CreatePracticeOutput,
    })
    @Post()
    @UseGuards(MemberGuard)
    postPractices(
        @AuthMember() authMember: Member,
        @Body() createPracticeInput: CreatePracticeInput,
    ): Promise<CreatePracticeOutput> {
        return this.practicesService.createPractice(
            authMember,
            createPracticeInput,
        );
    }
}
