import { CoreOutput } from 'src/common/dtos/output.dto';

export class DeleteMemberOutput extends CoreOutput {}

export interface DeleteMemberOption {
    // DB의 모든 Row, S3에 저장되어 있는 Video 및 JSON 파일들 삭제
    purge?: boolean;
}
