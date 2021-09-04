import {
    IsDate,
    IsEnum,
    IsNumber,
    IsNumberString,
    IsString,
    IsUrl,
} from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { AnalysisGradeCode } from 'src/common/enums/code.enum';
import { Member } from 'src/members/entities/members.entity';
import { RefVideo } from 'src/ref-videoes/entities/ref-video.entity';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    RelationId,
} from 'typeorm';

@Entity()
export class Analysis extends CoreEntity {
    @PrimaryGeneratedColumn({ name: 'an_seq', type: 'bigint' })
    @IsNumberString()
    anSeq: string;

    @ManyToOne((type) => Member, (member) => member.analyses)
    @JoinColumn({ name: 'mbr_seq' })
    member: Member;

    @RelationId((analysis: Analysis) => analysis.member)
    memberId: string;

    @ManyToOne((type) => RefVideo, (refVideo) => refVideo.analyses)
    @JoinColumn({ name: 'rv_seq' })
    refVideo: RefVideo;

    @RelationId((analysis: Analysis) => analysis.refVideo)
    refSeq: string;

    @Column({ name: 'an_score', type: 'int' })
    @IsNumber()
    anScore: number;

    @Column({ name: 'an_grade_cd', type: 'varchar', length: 50 })
    @IsEnum(AnalysisGradeCode)
    anGradeCode: string;

    @Column({ name: 'an_user_video_duration', type: 'time' })
    @IsString()
    anUserVideoDuration: string;

    @Column({ name: 'an_user_video_url', type: 'varchar', length: 255 })
    @IsUrl()
    anUserVideoURL: string;

    @Column({
        name: 'an_user_video_motion_data_url',
        type: 'varchar',
        length: '255',
    })
    @IsUrl()
    anUserVideoMotionDataURL: string;

    @Column({ name: 'an_simularity_url', type: 'varchar', length: 255 })
    @IsUrl()
    anSimularityURL: string;
}
