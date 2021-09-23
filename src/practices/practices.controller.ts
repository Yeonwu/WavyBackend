import { Body, Controller, Get, Post } from '@nestjs/common';
import {
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import {
    CreatePracticeInput,
    CreatePracticeOutput,
} from './dtos/create-practice.dto';
import { PracticesTodaySumOutput } from './dtos/practices-today-sum.dto';
import { PracticesService } from './practices.service';

@ApiTags('연습')
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
    getPracticesTodaySum(): Promise<PracticesTodaySumOutput> {
        // TODO: getPractices의 인자에서 authMember를 받아와야함
        const authMember = null;
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
    postPractices(
        @Body() createPracticeInput: CreatePracticeInput,
    ): Promise<CreatePracticeOutput> {
        // TODO: getPractices의 인자에서 authMember를 받아와야함
        const authMember = null;
        return this.practicesService.createPractice(
            authMember,
            createPracticeInput,
        );
    }
}
