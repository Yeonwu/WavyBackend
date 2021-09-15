import { IsString } from 'class-validator';
import {
    PaginationInput,
    PaginationOutput,
} from 'src/common/dtos/pagination.dto';
import { RefVideo } from '../entities/ref-video.entity';

export class SearchRefVideosInput extends PaginationInput {
    @IsString()
    query: string;
}

export class SearchRefVideosOutput extends PaginationOutput {
    refVideos?: RefVideo[];
}
