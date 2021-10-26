import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsArray,
    IsNumber,
    IsNumberString,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';
import { number } from 'joi';
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

export class GetStaticsInput {
    @ApiProperty({
        description: '가장 잘 춘 춤의 개수',
        type: number,
    })
    @IsNumberString()
    @IsOptional()
    dancegoodlimit?: number;

    @ApiProperty({
        description: '가장 자주 춘 춤의 개수',
        type: number,
    })
    @IsNumberString()
    @IsOptional()
    danceoftenlimit?: number;
}
