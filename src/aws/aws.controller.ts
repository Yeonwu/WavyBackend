import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { AuthMember } from 'src/auth/auth-member.decorator';
import { MemberGuard } from 'src/auth/auth.guard';
import { Member } from 'src/members/entities/members.entity';
import { AwsService } from './aws.service';
import {
    GetS3DownloadSignedUrlInput,
    GetS3DownloadSignedUrlOutput,
} from './dtos/get-s3-download-signed-url.dto';
import { GetS3UploadSignedUrlOutput } from './dtos/get-s3-upload-signed-url.dto';

@ApiTags('분석')
@Controller()
export class AwsController {
    constructor(private readonly awsService: AwsService) {}

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
    @Get('analysis/s3-download-signed-url')
    @UseGuards(MemberGuard)
    getS3DownloadSignedUrl(
        @AuthMember() authMember: Member,
        @Query() getS3SignedUrlInput: GetS3DownloadSignedUrlInput,
    ): Promise<GetS3DownloadSignedUrlOutput> {
        return this.awsService.getS3DownloadSignedUrl(
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
    @Get('analysis/s3-upload-signed-url')
    @UseGuards(MemberGuard)
    getS3UploadSignedUrl(): Promise<GetS3UploadSignedUrlOutput> {
        return this.awsService.getS3UploadSignedUrl();
    }
}
