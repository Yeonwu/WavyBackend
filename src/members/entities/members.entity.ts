import {
    IsEmail,
    IsEnum,
    IsNumber,
    IsNumberString,
    IsOptional,
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
import { Practice } from 'src/practices/entities/practice.entity';
import { MemberExpHistory } from './mbr-exp-history.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RefVideo } from 'src/ref-videos/entities/ref-video.entity';
import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';

@Entity()
@Unique(['mbrKakaoSeq'])
export class Member extends CoreEntity {
    @PrimaryGeneratedColumn({ name: 'mbr_seq', type: 'bigint' })
    @IsNumberString()
    @ApiProperty({ name: 'mbrSeq', description: '회원 일련번호', type: String })
    mbrSeq: string;

    @Column({ name: 'mbr_email', type: 'varchar', length: 255 })
    @ApiProperty({ description: '회원 이메일', type: String })
    @IsEmail()
    mbrEmail: string;

    @Column({ name: 'mbr_kakao_seq', type: 'bigint', nullable: true })
    @IsOptional()
    @IsNumber()
    mbrKakaoSeq: string;

    @Column({ name: 'mbr_nickname', type: 'varchar', length: 255 })
    @ApiProperty({
        name: 'mbrNickname',
        description: '회원 닉네임',
        type: String,
    })
    @IsString()
    mbrNickname: string;

    @Column({
        name: 'mbr_certification_method_cd',
        type: 'varchar',
        length: 50,
    })
    @ApiProperty({
        description:
            '인증 방법 코드. 회원이 카카오, 페이스북 등 어떤 방법으로 로그인하는지에 대한 정보',
        enum: MemberCertificationMethodCode,
    })
    @IsEnum(MemberCertificationMethodCode)
    certificationMethodCode: string;

    @Column({
        name: 'mbr_profile_image_url',
        type: 'varchar',
        length: 255,
        nullable: true,
    })
    @ApiPropertyOptional({
        description: '회원 프로필 이미지 URL',
        type: String,
    })
    @IsUrl()
    profileImageUrl?: string;

    @Column({ name: 'mbr_privacy_consent', type: 'varchar', length: 50 })
    @ApiProperty({
        description: '개인정보이용약관 동의코드',
        enum: MemberPrivacyConsentCode,
    })
    @IsEnum(MemberPrivacyConsentCode)
    privacyConsentCode: string;

    @Column({ name: 'mbr_marketing_consent', type: 'varchar', length: 50 })
    @ApiProperty({
        description: '마케팅수집이용 동의코드',
        enum: MemberMarketingConsentCode,
    })
    @IsEnum(MemberMarketingConsentCode)
    marketingConsentCode: string;

    @Column({
        name: 'mbr_video_option',
        type: 'varchar',
        length: 50,
        default: '40002',
    })
    @ApiProperty({
        description: '영상인식옵션 코드',
        enum: MemberVideoOptionCode,
    })
    @IsEnum(MemberVideoOptionCode)
    videoOptionCode: string;

    @OneToMany((type) => Analysis, (analysis) => analysis.member)
    analyses: Analysis[];

    @OneToMany((type) => Practice, (practice) => practice.member)
    practices: Practice[];

    @OneToMany(
        (type) => MemberExpHistory,
        (memberExpHistory: MemberExpHistory) => memberExpHistory.member,
    )
    memberExpHistories: MemberExpHistory[];

    @Column({ name: 'mbr_deleted', type: 'boolean', default: false })
    mbrDeleted: boolean;

    @ManyToMany((type) => RefVideo)
    @JoinTable({
        name: 'bookmarks',
        joinColumn: {
            name: 'mbr_seq',
            referencedColumnName: 'mbrSeq',
        },
        inverseJoinColumn: {
            name: 'rv_seq',
            referencedColumnName: 'rvSeq',
        },
    })
    bookmarkedRefVideos: RefVideo[];
}
