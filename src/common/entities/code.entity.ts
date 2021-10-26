import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsNumber,
    IsNumberString,
    IsOptional,
    IsString,
} from 'class-validator';
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
    @ApiProperty({ type: String, description: '그룹코드' })
    @PrimaryColumn({ name: 'group_cd', type: 'varchar', length: 50 })
    @IsNumberString()
    groupCode: string;

    @ApiProperty({ type: String, description: '그룹이름' })
    @Column({ name: 'group_name', type: 'varchar', length: 50 })
    @IsString()
    groupName: string;

    @OneToMany((type) => GroupDetail, (groupDetail) => groupDetail.group)
    groupDetails: GroupDetail[];
}

@Entity()
export class GroupDetail extends CoreEntity {
    @ApiProperty({ type: String, description: '그룹상세코드' })
    @PrimaryColumn({ name: 'group_detail_cd', type: 'varchar', length: 50 })
    @IsNumberString()
    groupDetailCode: string;

    @RelationId((groupDetail: GroupDetail) => groupDetail.group)
    groupCode: string;

    @ApiPropertyOptional({ type: String, description: '속성1' })
    @Column({ name: 'value1', type: 'varchar', length: 50, nullable: true })
    @IsString()
    @IsOptional()
    value1?: string;

    @ApiPropertyOptional({ type: String, description: '속성2' })
    @Column({ name: 'value2', type: 'int', nullable: true })
    @IsNumber()
    @IsOptional()
    value2?: number;

    @ManyToOne((type) => Group, (group) => group.groupDetails)
    @JoinColumn({ name: 'group_cd' })
    group: Group;
}
