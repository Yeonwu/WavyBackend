import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';

export class DancesGoodAt {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsNumber()
    averageScore: number;
}

export class DancesOften {
    @ApiProperty()
    @IsNumber()
    name: string;

    @ApiProperty()
    @IsNumber()
    times: number;
}

export class GetStaticsEntity {
    @ApiProperty()
    @IsString()
    totalPracticeTime: string; // 시간을 보통 어떻게 표현하지??

    @ApiProperty()
    @IsString()
    favorateDancer: string;

    @ApiProperty({ type: [DancesGoodAt] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type((type) => DancesGoodAt)
    dancesGoodAt: Array<DancesGoodAt>;

    @ApiProperty({ type: [DancesOften] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type((type) => DancesGoodAt)
    dancesOften: Array<DancesOften>;
}
export class GetStaticsOuput extends CoreOutput {
    @ApiProperty()
    @ValidateNested()
    statics?: GetStaticsEntity;
}

export interface GetStaticsOptions {
    dancesGoodAtLimit?: number;
    dancesOftenLimit?: number;
}
