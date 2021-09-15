import {
    IsEmail,
    IsEnum,
    IsNumberString,
    IsString,
    IsUrl,
} from 'class-validator';
import { Analysis } from 'src/analyses/entities/analyses.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import {
    MemberRefVideoIsBookmarkedCode,
    MemberMarketingConsentCode,
    MemberPrivacyConsentCode,
    MemberVideoOptionCode,
    MemberCertificationMethodCode,
} from 'src/common/enums/code.enum';
import { MemberRefVideo } from 'src/members-ref-videoes/entities/members-ref-videoes.entity';
import { Practice } from 'src/practices/entities/practice.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MemberExpHistory } from './mbr-exp-history.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Member extends CoreEntity {
    @PrimaryGeneratedColumn({ name: 'mbr_seq', type: 'bigint' })
    @IsNumberString()
    @ApiProperty()
    mbrSeq: string;

    @Column({ name: 'mbr_email', type: 'varchar', length: 255 })
    @ApiProperty()
    @IsEmail()
    mbrEmail: string;

    @Column({ name: 'mbr_nickname', type: 'varchar', length: 255 })
    @ApiProperty()
    @IsString()
    mbrNickname: string;

    @Column({
        name: 'mbr_certification_method_cd',
        type: 'varchar',
        length: 50,
    })
    @ApiProperty()
    @IsEnum(MemberCertificationMethodCode)
    certificationMethodCode: string;

    @Column({
        name: 'mbr_profile_image_url',
        type: 'varchar',
        length: 255,
        nullable: true,
    })
    @ApiProperty()
    @IsUrl()
    profileImageUrl: string;

    @Column({ name: 'mbr_privacy_consent', type: 'varchar', length: 50 })
    @ApiProperty()
    @IsEnum(MemberPrivacyConsentCode)
    privacyConsentCode: string;

    @Column({ name: 'mbr_marketing_consent', type: 'varchar', length: 50 })
    @ApiProperty()
    @IsEnum(MemberMarketingConsentCode)
    marketingConsentCode: string;

    @Column({
        name: 'mbr_video_option',
        type: 'varchar',
        length: 50,
        default: '40002',
    })
    @ApiProperty()
    @IsEnum(MemberVideoOptionCode)
    videoOptionCode: string;

    @OneToMany((type) => Analysis, (analysis) => analysis.member)
    analyses: Analysis[];

    @OneToMany((type) => Practice, (practice) => practice.member)
    practices: Practice[];

    @OneToMany(
        (type) => MemberRefVideo,
        (memberRefVideo) => memberRefVideo.member,
    )
    memberRefVideoes: MemberRefVideo[];

    @OneToMany(
        (type) => MemberExpHistory,
        (memberExpHistory: MemberExpHistory) => memberExpHistory.member,
    )
    memberExpHistory: MemberExpHistory;
}
