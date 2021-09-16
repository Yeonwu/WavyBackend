import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { RefVideo } from 'src/ref-videos/entities/ref-video.entity';

export class CreateBookmarkInput {
    @ApiProperty({ type: Number, description: '보관하고 싶은 학습용 영상 ID' })
    @IsNumber()
    refVideoId: number;
}

export class CreateBookmarkOutput extends CoreOutput {
    @ApiPropertyOptional({
        type: RefVideo,
        description: '보관한 학습용 동영상',
    })
    @IsOptional()
    bookmarkedRefVideo?: RefVideo;
}
