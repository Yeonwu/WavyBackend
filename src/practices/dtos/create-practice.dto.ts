import { CoreOutput } from 'src/common/dtos/output.dto';
import { Practice } from '../entities/practice.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';
import { PracticeVideoTypeCode } from 'src/common/enums/code.enum';

export class CreatePracticeInput {
    @ApiProperty({ type: String, description: '연습 시작시간' })
    @IsString()
    ptStarted: string;

    @ApiProperty({ type: String, description: '연습 종료시간' })
    @IsString()
    ptFinished: string;

    @ApiProperty({
        enum: PracticeVideoTypeCode,
        description: '연습에 사용된 영상의 타입(학습용 영상 또는 유튜브 영상)',
    })
    @IsEnum(PracticeVideoTypeCode)
    ptVideoTypeCode: string;

    @ApiPropertyOptional({
        type: String,
        description: '연습에 사용된 영상의 외부 URL',
    })
    @IsUrl()
    @IsOptional()
    ptVideoUrl?: string;
}

export class CreatePracticeOutput extends CoreOutput {
    @ApiPropertyOptional({ type: Practice, description: '저장된 연습' })
    @IsOptional()
    practice?: Practice;
}
