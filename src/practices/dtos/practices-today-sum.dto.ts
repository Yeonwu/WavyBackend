import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';

export class PracticesTodaySumOutput extends CoreOutput {
    @ApiPropertyOptional({ type: String, description: '금일 누적 연습시간' })
    @IsString()
    @IsOptional()
    practicesTodaySum?: string;
}
