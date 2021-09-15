import { IsNumber } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';

export class DeleteBookmarkInput {
    @IsNumber()
    refVideoId: number;
}

export class DeleteBookmarkOutput extends CoreOutput {}
