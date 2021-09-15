import { IsNumber } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Tag } from '../entities/tag.entity';

export class TagsOutput extends CoreOutput {
    @IsNumber()
    totalResults?: number;

    tags?: Tag[];
}
