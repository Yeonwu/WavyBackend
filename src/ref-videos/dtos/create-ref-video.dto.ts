import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { RefVideo } from '../entities/ref-video.entity';

export class CreateRefVideoInput extends OmitType(RefVideo, [
    'createdDate',
    'updatedDate',
    'creatorSeq',
    'updaterSeq',
    'rvSeq',
    'analyses',
    'practices',
    'tags',
]) {}

export class CreateRefVideoOutput extends CoreOutput {
    @ApiPropertyOptional({
        type: RefVideo,
        description: '학습용 동영상 등록결과',
    })
    @IsOptional()
    refVideo?: RefVideo;
}
