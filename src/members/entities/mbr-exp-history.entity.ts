import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsNumberString } from 'class-validator';
import { string } from 'joi';
import { CoreEntity } from 'src/common/entities/core.entity';
import {
    MemberExpHistoryLevelCode,
    MemberExpHistoryTierCode,
} from 'src/common/enums/code.enum';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    RelationId,
} from 'typeorm';
import { Member } from './members.entity';

@Entity()
export class MemberExpHistory extends CoreEntity {
    @PrimaryGeneratedColumn({ name: 'meh_seq', type: 'bigint' })
    @ApiProperty({
        name: 'mehSeq',
        description: '회원 경험치 이력 일련번호',
        type: String,
    })
    @IsNumberString()
    mehSeq: string;

    @ManyToOne((type) => Member, (member) => member.memberExpHistories)
    @ApiProperty({
        name: 'member',
        description: '해당 경험치를 획득한 회원 정보',
        type: Member,
    })
    @JoinColumn({ name: 'mbr_seq' })
    member: Member;

    @RelationId((memberExpHistory: MemberExpHistory) => memberExpHistory.member)
    @ApiProperty({
        name: 'mbrSeq',
        description: '회원 일련번호',
        type: string,
    })
    mbrSeq: string;

    @Column({ name: 'meh_exp_gained', type: 'int' })
    @ApiProperty({
        name: 'mehExpGained',
        description: '획득한 경험치',
        type: Number,
    })
    @IsNumber()
    mehExpGained: number;

    @Column({ name: 'meh_exp_acc', type: 'int' })
    @ApiProperty({
        name: 'mehExpAcc',
        description: '누적 경험치(회원이 획득한 총 경험치)',
        type: Number,
    })
    @IsNumber()
    mehExpAcc: number;

    @Column({ name: 'meh_level_cd', type: 'varchar', length: 50 })
    @ApiProperty({
        name: 'mehLevel',
        description: '회원 레밸 코드',
        enum: MemberExpHistoryLevelCode,
    })
    @IsEnum(MemberExpHistoryLevelCode)
    mehLevel: string;

    @Column({ name: 'meh_tier_cd', type: 'varchar', length: 50 })
    @ApiProperty({
        name: 'mehTier',
        description: '회원 티어 코드',
        enum: MemberExpHistoryTierCode,
    })
    @IsEnum(MemberExpHistoryTierCode)
    mehTier: string;
}
