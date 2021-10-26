import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUrl } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';

export class GetKakoLoginUrlOutput extends CoreOutput {
    @ApiProperty({
        description: '카카오 로그인 창으로 들어가는 url',
        type: String,
    })
    @IsUrl()
    @IsOptional()
    url?: string;
}
