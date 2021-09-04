import { IsNumber, IsNumberString, IsString } from 'class-validator';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
    RelationId,
} from 'typeorm';
import { CoreEntity } from './core.entity';

@Entity()
export class Group extends CoreEntity {
    @PrimaryColumn({ name: 'group_cd', type: 'varchar', length: 50 })
    @IsNumberString()
    groupCode: string;

    @Column({ name: 'group_name', type: 'varchar', length: 50 })
    @IsString()
    groupName: string;

    @OneToMany((type) => GroupDetail, (groupDetail) => groupDetail.group)
    groupDetails: GroupDetail[];
}

@Entity()
export class GroupDetail extends CoreEntity {
    @PrimaryColumn({ name: 'group_detail_cd', type: 'varchar', length: 50 })
    @IsNumberString()
    groupDetailCode: string;

    @RelationId((groupDetail: GroupDetail) => groupDetail.group)
    groupCode: string;

    @Column({ name: 'value1', type: 'varchar', length: 50, nullable: true })
    @IsString()
    value1?: string;

    @Column({ name: 'value2', type: 'int', nullable: true })
    @IsNumber()
    value2?: number;

    @ManyToOne((type) => Group, (group) => group.groupDetails)
    @JoinColumn({ name: 'group_cd' })
    group: Group;
}
