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
            'S3에 업로드될 파일명. AWS에서 자동으로 파일명을 변경해줍니다. 클라이언트에서 파일명을 변경할 필요는 없습니다. 다만 업로드한 후 등록 API를 호출할 때 이 값을 기준으로 호출해주세요.',
        type: String,
    })
    @IsUrl()
    @IsOptional()
    s3ObjectName?: string;
}
