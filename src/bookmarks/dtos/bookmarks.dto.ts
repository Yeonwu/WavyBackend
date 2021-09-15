import {
    PaginationInput,
    PaginationOutput,
} from 'src/common/dtos/pagination.dto';
import { RefVideo } from 'src/ref-videos/entities/ref-video.entity';

export class BookmarksInput extends PaginationInput {}

export class BookmarksOutput extends PaginationOutput {
    bookmarkedRefVideos?: RefVideo[];
}
