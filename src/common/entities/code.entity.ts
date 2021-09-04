import { IsNumberString, IsString } from 'class-validator';
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
  @PrimaryColumn({ name: 'group_cd' })
  @IsNumberString()
  groupCode: string;

  @Column({ name: 'group_name' })
  @IsString()
  groupName: string;

  @OneToMany((type) => GroupDetail, (groupDetail) => groupDetail.group)
  groupDetails: GroupDetail[];
}

@Entity()
export class GroupDetail extends CoreEntity {
  @PrimaryColumn({ name: 'group_detail_cd' })
  @IsNumberString()
  groupDetailCode: string;

  @RelationId((groupDetail: GroupDetail) => groupDetail.group)
  groupCode: string;

  @ManyToOne((type) => Group, (group) => group.groupDetails)
  @JoinColumn({ name: 'group_cd' })
  group: Group;
}
