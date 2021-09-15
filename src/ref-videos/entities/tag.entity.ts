import { IsNumberString, IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { RefVideo } from './ref-video.entity';

@Entity()
export class Tag extends CoreEntity {
    @PrimaryGeneratedColumn({ name: 'tag_seq', type: 'bigint' })
    @IsNumberString()
    tagSeq: number;

    @Column({ name: 'tag_name', type: 'varchar', length: 255 })
    @IsString()
    tagName: string;

    @ManyToMany((type) => RefVideo, (refVideo) => refVideo.tags)
    @JoinTable()
    refVideos: RefVideo[];
}
