import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';

export class DeleteBookmarkInput {
    @ApiProperty({
        type: Number,
        description: '보관을 삭제하고 싶은 학습용 영상 ID',
    })
    @IsNumber()
    refVideoId: number;
}

export class DeleteBookmarkOutput extends CoreOutput {}
