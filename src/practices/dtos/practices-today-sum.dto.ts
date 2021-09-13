import { IsString } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';

export class PracticesTodaySumOutput extends CoreOutput {
    @IsString()
    practicesTodaySum?: string;
}
