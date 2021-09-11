import { IsEnum, IsNumber, IsNumberString } from 'class-validator';
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
    @IsNumberString()
    mehSeq: number;

    @ManyToOne((type) => Member, (member) => member.memberExpHistory)
    @JoinColumn({ name: 'mbr_seq' })
    member: Member;

    @RelationId((memberExpHistory: MemberExpHistory) => memberExpHistory.member)
    memberSeq: string;

    @Column({ name: 'meh_exp_gained', type: 'int' })
    @IsNumber()
    mehExpGained: number;

    @Column({ name: 'meh_exp_acc', type: 'int' })
    @IsNumber()
    mehExpAcc: number;

    @Column({ name: 'meh_level_cd', type: 'varchar', length: 50 })
    @IsEnum(MemberExpHistoryLevelCode)
    mehLevel: string;

    @Column({ name: 'meh_tier_cd', type: 'varchar', length: 50 })
    @IsEnum(MemberExpHistoryTierCode)
    mehTier: string;
}
