import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOkResponse,
    ApiOperation,
    ApiQuery,
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
        description:
            '사용자 비디오를 저장한 S3 객체에 접근할 수 있는 URL을 받아옵니다.',
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
        description: '비디오를 업로드 할 수 있는 S3 URL을 받아옵니다.',
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

    @Get('test')
    getTest() {
        return `
        <form>
            <input name="file" , type="file" />
        </form>

        <script>
            function gogo(signedUrl) {
                let xhr = new XMLHttpRequest();
                xhr.open('PUT', signedUrl);
                let form = document.querySelector('form');
                let formData = new FormData(form);
                xhr.send(formData);
                console.log(xhr.response);
            }
        </script>
        `;
    }
}
