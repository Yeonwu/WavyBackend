import { IsEnum, IsNumberString, IsString, IsUrl } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { PracticeVideoTypeCode } from 'src/common/enums/code.enum';
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
export class Practice extends CoreEntity {
    @PrimaryGeneratedColumn({ name: 'pt_seq', type: 'bigint' })
    @IsNumberString()
    ptSeq: string;

    @Column({ name: 'pt_started', type: 'time' })
    @IsString()
    ptStarted: string;

    @Column({ name: 'pt_finished', type: 'time' })
    @IsString()
    ptFinished: string;

    @Column({ name: 'pt_video_type_cd', type: 'varchar', length: 50 })
    @IsEnum(PracticeVideoTypeCode)
    ptVideoTypeCode: string;

    @Column({ name: 'pt_video_url', type: 'varchar', length: 255 })
    @IsUrl()
    ptVideoUrl: string;

    @ManyToOne((type) => Member, (member) => member.practices)
    @JoinColumn({ name: 'mbr_seq' })
    member: Member;

    @RelationId((practice: Practice) => practice.member)
    mbrSeq: string;

    @ManyToOne((type) => RefVideo, (refVideo) => refVideo.practices)
    @JoinColumn({ name: 'rv_seq' })
    refVideo: RefVideo;

    @RelationId((practice: Practice) => practice.refVideo)
    rvSeq: string;
}
