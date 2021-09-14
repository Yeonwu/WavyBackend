import { IsNumber } from 'class-validator';
import { CoreOutput } from './output.dto';

export class PaginationInput {
    @IsNumber()
    page: number;

    static take = 9;
    static skip: (page: number) => number = (page) =>
        (page - 1) * PaginationInput.take;
}

export class PaginationOutput extends CoreOutput {
    @IsNumber()
    totalPages?: number;

    @IsNumber()
    totalResults?: number;
}
