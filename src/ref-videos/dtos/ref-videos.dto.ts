import {
    PaginationInput,
    PaginationOutput,
} from 'src/common/dtos/pagination.dto';
import { RefVideo } from '../entities/ref-video.entity';

export class RefVideosInput extends PaginationInput {}

export class RefVideosOutput extends PaginationOutput {
    refVideos?: RefVideo[];
}
