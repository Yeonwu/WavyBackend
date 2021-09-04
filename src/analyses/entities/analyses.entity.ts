import { IsDate, IsEnum, IsNumber, IsString, IsUrl } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { GradeCode } from 'src/common/enums/code.enum';
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
    @PrimaryGeneratedColumn()
    key: number;

    @ManyToOne((type) => Member, (member) => member.analyses)
    @JoinColumn({ name: 'mbr_seq' })
    member: Member;

    @RelationId((analysis: Analysis) => analysis.member)
    memberId: number;

    @ManyToOne((type) => RefVideo, (refVideo) => refVideo.analyses)
    @JoinColumn({ name: 'rv_seq' })
    refVideo: RefVideo;

    @RelationId((analysis: Analysis) => analysis.refVideo)
    refSeq: number;

    @Column({ name: 'an_score' })
    @IsNumber()
    score: number;

    @Column({ name: 'an_grade_cd' })
    @IsEnum(GradeCode)
    gradeCode: string;

    @Column({ name: 'an_user_video_duration', type: 'time' })
    @IsString()
    userVideoDuration: string;

    @Column({ name: 'an_user_video_url' })
    @IsUrl()
    userVideoURL: string;

    @Column({ name: 'an_user_video_motion_data_url' })
    @IsUrl()
    userVideoMotionDataURL: string;

    @Column({ name: 'an_simularity_url' })
    @IsUrl()
    simularityURL: string;

    @Column({ name: 'an_analysis_done_date' })
    @IsDate()
    AnalysisDoneDate: Date;
}
