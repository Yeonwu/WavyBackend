import { IsNumber } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { RefVideo } from 'src/ref-videos/entities/ref-video.entity';

export class CreateBookmarkInput {
    @IsNumber()
    refVideoId: number;
}

export class CreateBookmarkOutput extends CoreOutput {
    bookmarkedRefVideo?: RefVideo;
}
