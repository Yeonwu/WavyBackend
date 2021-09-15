import { CoreOutput } from 'src/common/dtos/output.dto';
import { RefVideo } from '../entities/ref-video.entity';

export class RefVideoOutput extends CoreOutput {
    refVideo?: RefVideo;
}
