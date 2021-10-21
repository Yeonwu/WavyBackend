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
} from '@nestjs/common';
import {
    CreateMemberInput,
    CreateMemberOutput,
} from './dtos/create-member.dto';
import { DeleteMemberOutput } from './dtos/delete-member.dto';
import {
    getLoggedInMemberOutput,
    GetMemberOutput,
} from './dtos/get-member.dto';
import {
    GetStaticsInput,
    GetStaticsOptions,
    GetStaticsOuput,
} from './dtos/get-statics.dto';
import {
    UpdateMemberInput,
    UpdateMemberOutput,
} from './dtos/update-member.dto';
import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { MembersService } from './members.service';
import { MbrStaticsSerivce } from './mbr-statics.service';
import { AccessTokenGuard, MemberGuard } from 'src/auth/auth.guard';
import { AuthJwtDecoded } from 'src/auth/dtos/auth-jwt-core';
import {
    CreateMbrExpHistoryInput,
    CreateMbrExpHistoryOutput,
} from './dtos/create-mbr-exp-history';
import { GetMbrExpHistoryOutput } from './dtos/get-mbr-exp-history';
import { MbrExpHistoriesService } from './mbr-exp-histories.service';
import { Member } from './entities/members.entity';
import { AuthMember } from 'src/auth/auth-member.decorator';
import { AuthJwt } from 'src/auth/auth-jwt.decorator';
import { GetS3UploadSignedUrlOutput } from 'src/aws/dtos/get-s3-upload-signed-url.dto';
import { GetS3DownloadSignedUrlOutput } from 'src/aws/dtos/get-s3-download-signed-url.dto';
import { UserImageS3Service } from 'src/aws/aws-user-image.service';

@ApiTags('회원')
@ApiBearerAuth('access-token')
@Controller('members')
export class MembersController {
    constructor(
        private readonly membersSerivce: MembersService,
        private readonly mbrStaticsService: MbrStaticsSerivce,
        private readonly mbrExpHistoriesService: MbrExpHistoriesService,
        private readonly userImageS3Service: UserImageS3Service,
    ) {}

    @ApiOperation({
        summary: '회원 경험치 등록',
        description:
            '회원이 경험치를 획득했을 경우 호출하여 회원 경험치를 등록합니다.',
    })
    @ApiResponse({
        status: 201,
        description:
            '회원 경험치를 등록하고, 갱신된 회원 경험치 이력을 불러옵니다.',
        type: CreateMbrExpHistoryOutput,
    })
    @Post('exp')
    @UseGuards(MemberGuard)
    async createExpHistory(
        @Body() expHistoryInput: CreateMbrExpHistoryInput,
        @AuthMember() member: Member,
    ): Promise<CreateMbrExpHistoryOutput> {
        return this.mbrExpHistoriesService.createExpHistory(
            expHistoryInput,
            member,
        );
    }

    @ApiOperation({
        summary: '회원 경험치 이력 조회',
        description: '최신 회원 경험치 이력을 불러옵니다.',
    })
    @ApiResponse({
        status: 200,
        description: '최신 회원 경험치 이력을 불러옵니다.',
        type: GetMbrExpHistoryOutput,
    })
    @Get('exp')
    @UseGuards(MemberGuard)
    async getExpHistory(
        @AuthMember() member: Member,
    ): Promise<GetMbrExpHistoryOutput> {
        return this.mbrExpHistoriesService.getExpHistory(member.mbrSeq);
    }

    @UseGuards(AccessTokenGuard)
    @ApiOperation({
        summary: '회원 등록',
        description: '회원 가입시 호출하여 회원 정보를 등록합니다.',
    })
    @ApiCreatedResponse({
        description: '회원을 등록하고 등록한 정보를 불러옵니다.',
        type: CreateMemberOutput,
    })
    @Post('signup')
    async createMember(
        @Body() createMemberInput: CreateMemberInput,
        @AuthJwt() jwt: AuthJwtDecoded,
    ): Promise<CreateMemberOutput> {
        return await this.membersSerivce.createMember(createMemberInput, jwt);
    }

    @ApiOperation({
        summary: '로그인한 유저 정보 조회',
        description: '로그인한 유저의 정보를 불러옵니다.',
    })
    @ApiOkResponse({
        description: '로그인한 유저의 정보를 불러옵니다.',
        type: getLoggedInMemberOutput,
    })
    @Get('me')
    @UseGuards(MemberGuard)
    async getLoggedInMember(@AuthMember() member: Member) {
        return await this.membersSerivce.getLoggedInMember(member);
    }

    @ApiOperation({
        summary: '사용자 프로필 사진에 접근하는 URL 받아오기',
        description: `사용자 프로필 사진을 저장한 S3 객체에 접근할 수 있는 URL을 받아옵니다.
         파일이 존재하지 않더라도 URL이 리턴됩니다.
          존재하지 않는 파일에 접근하는 URL로 요청하면 aws측에서 404응답과 함께 xml형식의 에러메세지를 리턴합니다.`,
    })
    @ApiBearerAuth('access-token')
    @ApiOkResponse({
        description: '정상적으로 URL을 받아왔습니다.',
        type: GetS3DownloadSignedUrlOutput,
    })
    @Get('image/s3-download-signed-url')
    @UseGuards(MemberGuard)
    getUserImageDownloadSignedUrl(
        @AuthMember() authMember: Member,
    ): Promise<GetS3DownloadSignedUrlOutput> {
        return this.userImageS3Service.getS3DownloadSignedUrl(authMember);
    }

    @ApiOperation({
        summary: 'S3 사용자 프로필을 업로드하는 URL 받아오기 ',
        description: `사용자 프로필을 업로드 할 수 있는 S3 URL과 파일명을 받아옵니다.\n
        업로드시 파일명은 상관없이 올려주셔도 괜찮습니다. 자동으로 변경됩니다.\n
        업로드가 성공적으로 완료될 경우 200 OK로 응답이 옵니다.\n
        업로드가 완료된 다음 분석요청 API를 호출해주세요.\n
        `,
    })
    @ApiBearerAuth('access-token')
    @ApiOkResponse({
        description: '정상적으로 URL을 받아왔습니다.',
        type: GetS3UploadSignedUrlOutput,
    })
    @ApiQuery({
        name: 'ext',
        description:
            "업로드할 이미지의 파일 확장자를 파싱해서 넣어주세요. 허용된 확장자는 대소문자 상관없이 'jpeg', 'gif', 'png', 'svg', 'jpg'입니다.",
        type: String,
    })
    @Get('image/s3-upload-signed-url')
    @UseGuards(MemberGuard)
    getS3UploadSignedUrl(
        @AuthMember() member: Member,
        @Query('ext') ext: string,
    ): Promise<GetS3UploadSignedUrlOutput> {
        return this.userImageS3Service.getS3UploadSignedUrl(member, ext);
    }

    @ApiOperation({
        summary: '회원 정보 조회',
        description: '회원 일련번호를 통해 해당 회원의 정보를 불러옵니다.',
    })
    @Get(':id')
    @UseGuards(MemberGuard)
    @ApiOkResponse({
        description: '회원 정보를 조회합니다.',
        type: GetMemberOutput,
    })
    async getMemberByID(@Param('id') id: string): Promise<GetMemberOutput> {
        return await this.membersSerivce.getMemberBySeq(id);
    }

    @ApiOperation({
        summary: '회원정보 수정',
        description: '로그인한 회원의 정보를 수정합니다.',
    })
    @ApiOkResponse({
        description: '회원정보를 수정합니다.',
        type: UpdateMemberOutput,
    })
    @Put()
    @UseGuards(MemberGuard)
    async updateMember(
        @AuthMember() member: Member,
        @Body() updateMemberInput: UpdateMemberInput,
    ): Promise<UpdateMemberOutput> {
        return await this.membersSerivce.updateMember(
            member.mbrSeq,
            updateMemberInput,
        );
    }

    @ApiOperation({
        summary: '회원 탈퇴',
        description: '로그인한 회원의 정보를 삭제하고 탈퇴합니다.',
    })
    @ApiOkResponse({
        description: '회원 정보를 삭제하고 탈퇴합니다. ',
        type: DeleteMemberOutput,
    })
    @Delete()
    @UseGuards(MemberGuard)
    async deleteMember(
        @AuthMember() member: Member,
    ): Promise<DeleteMemberOutput> {
        return await this.membersSerivce.deleteMember(member.mbrSeq);
    }

    @ApiOperation({
        summary: '회원 통계 조회',
        description: '회원의 통계 정보를 불러옵니다.',
    })
    @ApiOkResponse({
        description: '회원 통계 정보를 불러옵니다.',
        type: GetStaticsOuput,
    })
    @ApiQuery({ type: GetStaticsInput })
    @Get(':id/statics')
    @UseGuards(MemberGuard)
    async getStatics(
        @Param('id') id: string,
        @AuthMember() member: Member,
        @Query() getStaticsInput: GetStaticsInput,
    ): Promise<GetStaticsOuput> {
        const options: GetStaticsOptions = {
            dancesGoodAtLimit: getStaticsInput?.dancegoodlimit,
            dancesOftenLimit: getStaticsInput?.danceoftenlimit,
        };
        return await this.mbrStaticsService.getStatics(
            id,
            member.mbrSeq,
            options,
        );
    }
}
