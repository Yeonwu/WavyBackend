import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthJwt } from 'src/auth/auth-jwt.decorator';
import { MemberGuard } from 'src/auth/auth.guard';
import { AuthJwtDecoded } from 'src/auth/dtos/auth-jwt-core';
import { AnalysesService } from './analyses.service';
import { CreateAnalysisResultInput } from './dtos/create-analysis-result.dto';

export type SearchAnalysesOrderBy =
    | 'latest'
    | 'oldest'
    | 'highest-score'
    | 'lowest-score';

@Controller('analyses')
export class AnalysesController {
    constructor(private readonly analysesService: AnalysesService) {}

    @Get()
    @UseGuards(MemberGuard)
    getAnalyses(@AuthJwt() jwt: AuthJwtDecoded) {
        return this.analysesService.getAnalyses(jwt.mbrSeq);
    }

    @Get('search')
    @UseGuards(MemberGuard)
    searchAnalyses(
        @AuthJwt() jwt: AuthJwtDecoded,
        @Query('q') query: string,
        @Query('orderby') orderBy: SearchAnalysesOrderBy,
    ) {
        return this.analysesService.searchAnalyses(jwt.mbrSeq, query, orderBy);
    }

    @Get(':id')
    @UseGuards(MemberGuard)
    getAnalysisBySeq(
        @AuthJwt() jwt: AuthJwtDecoded,
        @Param('id') anSeq: string,
    ) {
        return this.analysesService.getAnalysisBySeq(jwt.mbrSeq, anSeq);
    }

    @Post()
    @UseGuards(MemberGuard)
    createAnalysisRequest(@Req() req: Request) {
        return this.analysesService.createAnalysisRequest(req);
    }

    @Post('result')
    @UseGuards(MemberGuard)
    createAnalysisResult(
        @AuthJwt() jwt: AuthJwtDecoded,
        @Body('analysis') analysis: CreateAnalysisResultInput,
    ) {
        return this.analysesService.createAnalysisResult(jwt.mbrSeq, analysis);
    }

    @Delete(':id')
    @UseGuards(MemberGuard)
    deleteAnalysis(@AuthJwt() jwt: AuthJwtDecoded, @Param('id') anSeq: string) {
        return this.analysesService.deleteAnalysis(jwt.mbrSeq, anSeq);
    }
}
