import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsUrl } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';

export class GetS3SignedUrlOutput extends CoreEntity {
    @ApiPropertyOptional({
        description: 'S3 객체(사용자 동영상)에 접근할 수 있는 URL',
        type: String,
    })
    @IsUrl()
    signedUrl: string;
}

export class GetS3SignedUrlInput {
    @ApiProperty({
        description: '분석 결과 ID',
        type: String,
    })
    @IsString()
    anSeq: string;
}
