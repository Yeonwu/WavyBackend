import { Body, Controller, Get, Post } from '@nestjs/common';
import {
    CreatePracticeInput,
    CreatePracticeOutput,
} from './dtos/create-practice.dto';
import { PracticesTodaySumOutput } from './dtos/practices-today-sum.dto';
import { PracticesService } from './practices.service';

@Controller('practices')
export class PracticesController {
    constructor(private readonly practicesService: PracticesService) {}

    @Get('/today/sum')
    getPracticesTodaySum(): Promise<PracticesTodaySumOutput> {
        // TODO: getPractices의 인자에서 authMember를 받아와야함
        const authMember = null;
        return this.practicesService.allPraticesTodaySum(authMember);
    }

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
