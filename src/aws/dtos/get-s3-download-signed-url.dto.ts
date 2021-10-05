import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';

export class GetS3DownloadSignedUrlOutput extends CoreOutput {
    @ApiPropertyOptional({
        description: 'S3 객체(사용자 동영상)에 접근할 수 있는 URL',
        type: String,
    })
    @IsUrl()
    @IsOptional()
    signedUrl?: string;
}

export class GetS3DownloadSignedUrlInput {
    @ApiProperty({
        description: '분석 결과 ID',
        type: String,
    })
    @IsString()
    anSeq: string;
}
