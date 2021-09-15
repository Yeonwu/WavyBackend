import { ApiProperty } from '@nestjs/swagger';
import { CoreOutput } from 'src/common/dtos/output.dto';

class DancesGoodAt {
    @ApiProperty()
    name: string;
    @ApiProperty()
    score: number;
}

class DancesOften {
    @ApiProperty()
    name: string;
    @ApiProperty()
    times: number;
}

export class ReadStaticsEntity {
    @ApiProperty()
    totalPracticeTime: string; // 시간을 보통 어떻게 표현하지??
    @ApiProperty()
    favorateDancer: string;
    @ApiProperty({ type: [DancesGoodAt] })
    dancesGoodAt: Array<DancesGoodAt>;
    @ApiProperty({ type: [DancesOften] })
    dancesOften: Array<DancesOften>;
}
export class ReadStaticsOuput extends CoreOutput {
    @ApiProperty()
    statics?: ReadStaticsEntity;
}
