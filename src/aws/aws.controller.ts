import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiQuery,
    ApiTags,
} from '@nestjs/swagger';
import { AuthMember } from 'src/auth/auth-member.decorator';
import { MemberGuard } from 'src/auth/auth.guard';
import { Member } from 'src/members/entities/members.entity';
import { AwsService } from './aws.service';
import { GetS3SignedUrlInput } from './dtos/get-s3-signed-url.dto';

@Controller('aws')
export class AwsController {
    constructor(private readonly awsService: AwsService) {}

    @ApiOperation({
        summary: '사용자 비디오에 접근하는 URL 받아오기',
        description:
            '사용자 비디오를 저장한 S3 객체에 접근할 수 있는 URL을 받아옵니다.',
    })
    @ApiTags('인증')
    @ApiBearerAuth('access-token')
    @Get('s3-download-signed-url')
    @UseGuards(MemberGuard)
    getS3DownloadSignedUrl(
        @AuthMember() authMember: Member,
        @Query() getS3SignedUrlInput: GetS3SignedUrlInput,
    ) {
        return this.awsService.getS3DownloadSignedUrl(
            authMember,
            getS3SignedUrlInput,
        );
    }
}
