import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsEnum,
    IsNumberString,
    IsOptional,
    IsString,
    IsUrl,
} from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { PracticeVideoTypeCode } from 'src/common/enums/code.enum';
import { Member } from 'src/members/entities/members.entity';
import { RefVideo } from 'src/ref-videos/entities/ref-video.entity';
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
    @ApiProperty({ type: String, description: '연습 ID' })
    @PrimaryGeneratedColumn({ name: 'pt_seq', type: 'bigint' })
    @IsNumberString()
    ptSeq: string;

    @ApiProperty({ type: String, description: '연습 시작시간' })
    @Column({ name: 'pt_started', type: 'timestamp' })
    @IsString()
    ptStarted: string;

    @ApiProperty({ type: String, description: '연습 종료시간' })
    @Column({ name: 'pt_finished', type: 'timestamp' })
    @IsString()
    ptFinished: string;

    @ApiProperty({
        enum: PracticeVideoTypeCode,
        description: '연습에 사용된 영상의 타입(학습용 영상 또는 유튜브 영상)',
    })
    @Column({ name: 'pt_video_type_cd', type: 'varchar', length: 50 })
    @IsEnum(PracticeVideoTypeCode)
    ptVideoTypeCode: string;

    @ApiPropertyOptional({
        type: String,
        description: '연습에 사용된 영상의 외부 URL',
    })
    @Column({
        name: 'pt_video_url',
        nullable: true,
        type: 'varchar',
        length: 255,
    })
    @IsUrl()
    @IsOptional()
    ptVideoUrl?: string;

    @ManyToOne((type) => Member, (member) => member.practices)
    @JoinColumn({ name: 'mbr_seq' })
    member: Member;

    @RelationId((practice: Practice) => practice.member)
    mbrSeq: string;

    @ManyToOne((type) => RefVideo, (refVideo) => refVideo.practices, {
        nullable: true,
    })
    @JoinColumn({ name: 'rv_seq' })
    refVideo?: RefVideo;

    @RelationId((practice: Practice) => practice.refVideo)
    rvSeq: string;
}
