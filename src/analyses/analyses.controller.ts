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
import { CoreOutput } from 'src/common/dtos/output.dto';
import { PaginationInput } from 'src/common/dtos/pagination.dto';
import { AnalysesService } from './analyses.service';
import {
    CreateAnalysisResultInput,
    CreateAnalysisResultOutput,
} from './dtos/create-analysis-result.dto';
import {
    GetAnalysesOutput,
    GetAnalysisBySeqOutput,
} from './dtos/get-analyses.dto';
import { SearchAnalysisQuery } from './dtos/search-analyses.dto';

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
    getAnalyses(
        @AuthJwt() jwt: AuthJwtDecoded,
        @Query() paginationInput: PaginationInput,
    ): Promise<GetAnalysesOutput> {
        const { page } = paginationInput;
        return this.analysesService.getAnalyses(jwt.mbrSeq, page);
    }

    @Get('search')
    @UseGuards(MemberGuard)
    searchAnalyses(
        @AuthJwt() jwt: AuthJwtDecoded,
        @Query() query: SearchAnalysisQuery,
    ): Promise<GetAnalysesOutput> {
        const { page, q, orderby } = query;
        return this.analysesService.searchAnalyses(
            jwt.mbrSeq,
            q,
            orderby,
            page,
        );
    }

    @Get(':id')
    @UseGuards(MemberGuard)
    getAnalysisBySeq(
        @AuthJwt() jwt: AuthJwtDecoded,
        @Param('id') anSeq: string,
    ): Promise<GetAnalysisBySeqOutput> {
        return this.analysesService.getAnalysisBySeq(jwt.mbrSeq, anSeq);
    }

    @Post()
    @UseGuards(MemberGuard)
    createAnalysisRequest(
        @Req() req: Request,
    ): Promise<CreateAnalysisResultOutput> {
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
    deleteAnalysis(
        @AuthJwt() jwt: AuthJwtDecoded,
        @Param('id') anSeq: string,
    ): Promise<CoreOutput> {
        return this.analysesService.deleteAnalysis(jwt.mbrSeq, anSeq);
    }
}
