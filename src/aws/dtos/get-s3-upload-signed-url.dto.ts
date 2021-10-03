import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUrl } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';

export class GetS3UploadSignedUrlOutput extends CoreOutput {
    @ApiPropertyOptional({
        description: 'POST로 업로드 요청을 보내는 URl',
        type: String,
    })
    @IsUrl()
    @IsOptional()
    signedUrl?: string;

    @ApiPropertyOptional({
        description:
            '업로드할 파일명. 업로드시 받아온 파일명으로 파일 이름을 변경하여 업로드해주세요.',
        type: String,
    })
    @IsUrl()
    @IsOptional()
    s3ObjectName?: string;
}
