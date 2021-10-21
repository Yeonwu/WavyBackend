import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
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
import { AuthJwt, RawJwt } from 'src/auth/auth-jwt.decorator';
import { AuthMember } from 'src/auth/auth-member.decorator';
import { MemberGuard } from 'src/auth/auth.guard';
import { AuthJwtDecoded } from 'src/auth/dtos/auth-jwt-core';
import { UserVideoS3Service } from 'src/aws/aws-user-video.service';
import {
    GetS3DownloadSignedUrlInput,
    GetS3DownloadSignedUrlOutput,
} from 'src/aws/dtos/get-s3-download-signed-url.dto';
import { GetS3UploadSignedUrlOutput } from 'src/aws/dtos/get-s3-upload-signed-url.dto';
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
    constructor(
        private readonly analysesService: AnalysesService,
        private readonly userVideoS3Service: UserVideoS3Service,
    ) {}

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
        summary: '사용자 비디오에 접근하는 URL 받아오기',
        description: `사용자 비디오를 저장한 S3 객체에 접근할 수 있는 URL을 받아옵니다.
         파일이 존재하지 않더라도 URL이 리턴됩니다.
          존재하지 않는 파일에 접근하는 URL로 요청하면 aws측에서 404응답과 함께 xml형식의 에러메세지를 리턴합니다.`,
    })
    @ApiBearerAuth('access-token')
    @ApiOkResponse({
        description: '정상적으로 URL을 받아왔습니다.',
        type: GetS3DownloadSignedUrlOutput,
    })
    @Get('s3-download-signed-url')
    @UseGuards(MemberGuard)
    getUserVideoDownloadSignedUrl(
        @AuthMember() authMember: Member,
        @Query() getS3SignedUrlInput: GetS3DownloadSignedUrlInput,
    ): Promise<GetS3DownloadSignedUrlOutput> {
        return this.userVideoS3Service.getS3DownloadSignedUrl(
            authMember,
            getS3SignedUrlInput,
        );
    }

    @ApiOperation({
        summary: 'S3 업로드 URL 받아오기 ',
        description: `비디오를 업로드 할 수 있는 S3 URL과 파일명을 받아옵니다.\n
        업로드시 파일명, 확장자는 상관없이 올려주셔도 괜찮습니다. 자동으로 변경됩니다.\n
        업로드가 성공적으로 완료될 경우 200 OK로 응답이 옵니다.\n
        업로드가 완료된 다음 분석요청 API를 호출해주세요.\n
        `,
    })
    @ApiBearerAuth('access-token')
    @ApiOkResponse({
        description: '정상적으로 URL을 받아왔습니다.',
        type: GetS3UploadSignedUrlOutput,
    })
    @Get('s3-upload-signed-url')
    @UseGuards(MemberGuard)
    getUserVideoSignedUrl(): Promise<GetS3UploadSignedUrlOutput> {
        return this.userVideoS3Service.getS3UploadSignedUrl();
    }

    @ApiOperation({
        summary: '분석결과 ID로 조회',
        description: '분석결과를 ID를 사용해 조회합니다.',
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
