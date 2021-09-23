import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { RefVideo } from '../entities/ref-video.entity';

export class RefVideoOutput extends CoreOutput {
    @ApiPropertyOptional({
        type: RefVideo,
        description: '학습용 동영상 조회결과',
    })
    @IsOptional()
    refVideo?: RefVideo;
}
