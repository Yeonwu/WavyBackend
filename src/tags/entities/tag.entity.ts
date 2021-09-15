import { IsNumberString, IsString, IsUrl } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Tag extends CoreEntity {
    @PrimaryGeneratedColumn({ name: 'tag_seq', type: 'bigint' })
    @IsNumberString()
    tagSeq: number;

    @Column({ name: 'tag_name', type: 'varchar', length: 255 })
    @IsString()
    tagName: string;

    @Column({ name: 'tag_url', nullable: true, type: 'varchar', length: 255 })
    @IsUrl()
    tagUrl?: string;
}
