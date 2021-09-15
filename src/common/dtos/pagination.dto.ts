import { IsNumber } from 'class-validator';
import { CoreOutput } from './output.dto';

export class PaginationInput {
    @IsNumber()
    page: number;
}

export class PaginationOutput extends CoreOutput {
    @IsNumber()
    totalPages?: number;

    @IsNumber()
    totalResults?: number;
}
