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
    UseInterceptors,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { AuthJwt, RawJwt } from 'src/auth/auth-jwt.decorator';
import { AuthMember } from 'src/auth/auth-member.decorator';
import { MemberGuard } from 'src/auth/auth.guard';
import { AuthJwtDecoded } from 'src/auth/dtos/auth-jwt-core';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { PaginationInput } from 'src/common/dtos/pagination.dto';
import { TimeoutInterceptor } from 'src/common/timeout.interceptor';
import { Member } from 'src/members/entities/members.entity';
import { AnalysesService } from './analyses.service';
import { CreateAnalysisRequestInput } from './dtos/create-analysis-request.dto';
import {
    CreateAnalysisResultInput,
    CreateAnalysisResultOutput,
} from './dtos/create-analysis-result.dto';
import {
    GetAnalysesBySeqInput,
    GetAnalysesOutput,
    GetAnalysisBySeqOutput,
} from './dtos/get-analyses.dto';
import { SearchAnalysisInput } from './dtos/search-analyses.dto';

@ApiTags('분석')
@ApiBearerAuth('access-token')
@Controller('analyses')
export class AnalysesController {
    constructor(private readonly analysesService: AnalysesService) {}

    @ApiOperation({
        summary: '분석결과 목록 조회',
        description: '로그인한 회원의 분석결과 목록을 조회합니다.',
    })
    @ApiOkResponse({
        description: '분석결과 목록을 조회합니다.',
        type: GetAnalysesOutput,
    })
    @Get()
    @UseGuards(MemberGuard)
    getAnalyses(
        @AuthJwt() jwt: AuthJwtDecoded,
        @Query() paginationInput: PaginationInput,
    ): Promise<GetAnalysesOutput> {
        const { page } = paginationInput;
        return this.analysesService.getAnalyses(jwt.mbrSeq, page);
    }

    @ApiOperation({
        summary: '분석결과 검색',
        description:
            '학습동영상의 제목 또는 아티스트명에 검색어가 포함된 분석결과목록을 조회합니다. ',
    })
    @ApiOkResponse({
        description: '검색어가 포함된 분석결과목록을 조회합니다.',
        type: GetAnalysesOutput,
    })
    @Get('search')
    @UseGuards(MemberGuard)
    searchAnalyses(
        @AuthJwt() jwt: AuthJwtDecoded,
        @Query() searchAnalysisInput: SearchAnalysisInput,
    ): Promise<GetAnalysesOutput> {
        const { page, q, orderby } = searchAnalysisInput;
        return this.analysesService.searchAnalyses(
            jwt.mbrSeq,
            q,
            orderby,
            page,
        );
    }

    @ApiOperation({
        summary: '분석결과 ID로 조회',
        description:
            '분석결과를 ID를 사용해 조회합니다. anSimularityFilename, anUserVideoMotionDataFilename은 바로 접근할 수 있는 URL로 변환되어 제공합니다.',
    })
    @ApiOkResponse({
        description: '분석결과를 ID를 사용해 조회합니다.',
        type: GetAnalysisBySeqOutput,
    })
    @Get(':id')
    @UseGuards(MemberGuard)
    getAnalysisBySeq(
        @AuthJwt() jwt: AuthJwtDecoded,
        @Param() getAnalysesBySeqInput: GetAnalysesBySeqInput,
    ): Promise<GetAnalysisBySeqOutput> {
        return this.analysesService.getAnalysisBySeq(
            jwt.mbrSeq,
            getAnalysesBySeqInput.id,
        );
    }

    @ApiOperation({
        summary: '영상 분석 요청',
        description: '사용자 영상 분석을 Queue에 등록하는 API입니다.',
    })
    @Post()
    @UseInterceptors(TimeoutInterceptor)
    @UseGuards(MemberGuard)
    createAnalysisRequest(
        @AuthMember() member: Member,
        @RawJwt() jwt: string,
        @Body() createAnalysisRequestInput: CreateAnalysisRequestInput,
    ): Promise<CreateAnalysisResultOutput> {
        return this.analysesService.createAnalysisRequest(
            member,
            createAnalysisRequestInput,
            jwt,
        );
    }

    @ApiOperation({
        summary: '영상 분석결과 등록',
        description: `영상 분석 결과를 DB에 등록하는 API입니다.\n
        클라이언트에서 호출하지 않고 머신러닝 인스턴스에서 호출하는 API입니다.`,
    })
    @ApiCreatedResponse({
        description:
            '영상 분석 결과를 DB에 등록하고 분석결과정보를 조회합니다.',
        type: CreateAnalysisResultOutput,
    })
    @Put('result')
    @UseGuards(MemberGuard)
    async createAnalysisResult(
        @AuthMember() member: Member,
        @Body() analysis: CreateAnalysisResultInput,
    ): Promise<CreateAnalysisResultOutput> {
        return await this.analysesService.createAnalysisResult(
            member.mbrSeq,
            analysis,
        );
    }

    @ApiOperation({
        summary: '분석결과 삭제',
        description: '분석결과를 삭제합니다.',
    })
    @ApiOkResponse({
        description: '분석결과를 삭제합니다.',
        type: CoreOutput,
    })
    @ApiParam({
        name: 'id',
        type: String,
        description: '삭제할 분석결과 ID',
    })
    @Delete(':id')
    @UseGuards(MemberGuard)
    async deleteAnalysis(
        @AuthJwt() jwt: AuthJwtDecoded,
        @Param('id') anSeq: string,
    ): Promise<CoreOutput> {
        return await this.analysesService.deleteAnalysis(jwt.mbrSeq, anSeq);
    }
}
