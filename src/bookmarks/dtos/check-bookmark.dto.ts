import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';

export class CheckBookmarkOutput extends CoreOutput {
    @ApiPropertyOptional({
        type: Boolean,
        description: '보관한 학습용 동영상',
    })
    @IsBoolean()
    @IsOptional()
    isBookmarked?: boolean;
}
