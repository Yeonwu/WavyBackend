import { IsEmail, IsEnum, IsString, IsUrl } from 'class-validator';
import { Analysis } from 'src/analyses/entities/analyses.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import {
    CertificationMethodCode,
    MarketingConsentCode,
    PrivacyConsentCode,
    VideoOptionCode,
} from 'src/common/enums/code.enum';
import {
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    RelationId,
} from 'typeorm';

@Entity()
export class Member extends CoreEntity {
    @PrimaryGeneratedColumn({ name: 'mbr_seq' })
    mbrSeq: number;

    @Column({ name: 'mbr_email' })
    @IsEmail()
    mbrEmail: string;

    @Column({ name: 'mbr_nickname' })
    @IsString()
    mbrNickname: string;

    @Column({ name: 'mbr_certification_method_cd' })
    @IsEnum(CertificationMethodCode)
    certificationMethodCode: string;

    @Column({ name: 'mbr_profile_image_url', nullable: true })
    @IsUrl()
    profileImageUrl: string;

    @Column({ name: 'mbr_privacy_consent' })
    @IsEnum(PrivacyConsentCode)
    privacyConsentCode: string;

    @Column({ name: 'mbr_marketing_consent' })
    @IsEnum(MarketingConsentCode)
    marketingConsentCode: string;

    @Column({ name: 'mbr_video_option', default: '40002' })
    @IsEnum(VideoOptionCode)
    videoOptionCode: string;

    @OneToMany((type) => Analysis, (analysis) => analysis.member)
    analyses: Analysis[];
}
