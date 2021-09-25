import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';

export class DeleteBookmarkInput {
    @ApiProperty({
        type: String,
        description: '보관을 삭제하고 싶은 학습용 영상 ID',
    })
    @IsString()
    rvSeq: string;
}

export class DeleteBookmarkOutput extends CoreOutput {}
