import { ApiProperty } from '@nestjs/swagger';
import {
    IsBoolean,
    IsEnum,
    IsNumber,
    IsNumberString,
    IsOptional,
    IsString,
    IsUrl,
} from 'class-validator';
import { string } from 'joi';
import { CoreEntity } from 'src/common/entities/core.entity';
import { AnalysisGradeCode } from 'src/common/enums/code.enum';
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
export class Analysis extends CoreEntity {
    @ApiProperty({
        description: '분석 결과 ID',
        type: String,
    })
    @PrimaryGeneratedColumn({ name: 'an_seq', type: 'bigint' })
    @IsNumberString()
    anSeq: string;

    @ManyToOne((type) => Member, (member) => member.analyses)
    @JoinColumn({ name: 'mbr_seq' })
    member: Member;

    @RelationId((analysis: Analysis) => analysis.member)
    @IsNumberString()
    mbrSeq: string;

    @ApiProperty({
        description: '학습 동영상 정보',
        type: RefVideo,
    })
    @ManyToOne((type) => RefVideo, (refVideo) => refVideo.analyses)
    @JoinColumn({ name: 'rv_seq' })
    refVideo: RefVideo;

    @ApiProperty({
        description: '학습 동영상 ID',
        type: String,
    })
    @RelationId((analysis: Analysis) => analysis.refVideo)
    @IsNumberString()
    rvSeq: string;

    @ApiProperty({
        description: '점수',
        type: Number,
        nullable: true,
    })
    @Column({ name: 'an_score', type: 'int', nullable: true })
    @IsNumber()
    @IsOptional()
    anScore: number;

    @ApiProperty({
        description: '등급 코드',
        enum: AnalysisGradeCode,
        nullable: true,
    })
    @Column({
        name: 'an_grade_cd',
        type: 'varchar',
        length: 50,
        nullable: true,
    })
    @IsEnum(AnalysisGradeCode)
    @IsOptional()
    anGradeCode: string;

    @ApiProperty({
        description: '사용자 영상 길이. hh:mm:ss 형식으로 표현됨.',
        type: String,
        nullable: true,
    })
    @Column({ name: 'an_user_video_duration', type: 'time', nullable: true })
    @IsString()
    @IsOptional()
    anUserVideoDuration: string;

    @ApiProperty({
        description: '사용자 영상 S3 url',
        type: String,
    })
    @Column({ name: 'an_user_video_url', type: 'varchar', length: 255 })
    @IsUrl()
    anUserVideoURL: string;

    @ApiProperty({
        description: '사용자 영상 모션 데이터 S3 url',
        type: String,
        nullable: true,
    })
    @Column({
        name: 'an_user_video_motion_data_url',
        type: 'varchar',
        length: '255',
        nullable: true,
    })
    @IsUrl()
    @IsOptional()
    anUserVideoMotionDataURL: string;

    @ApiProperty({
        description: '사용자 영상 유사도 분석 데이터 S3 url',
        type: String,
        nullable: true,
    })
    @Column({
        name: 'an_simularity_url',
        type: 'varchar',
        length: 255,
        nullable: true,
    })
    @IsUrl()
    @IsOptional()
    anSimularityURL: string;

    @Column({ name: 'an_deleted', type: 'boolean', default: false })
    @IsBoolean()
    anDeleted: boolean;

    @ApiProperty({
        description: '분석 진행 상황 코드',
        enum: AnalysisStatusCode,
    })
    @Column({
        name: 'an_status_cd',
        type: 'varchar',
        length: 50,
    })
    @IsEnum(AnalysisStatusCode)
    anStatusCode: AnalysisStatusCode;
}
