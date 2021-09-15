import { IsEnum, IsNumberString, IsString, IsUrl } from 'class-validator';
import { Analysis } from 'src/analyses/entities/analyses.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import {
    RefVideoDifficultyCode,
    RefVideoSourceCode,
} from 'src/common/enums/code.enum';
import { Practice } from 'src/practices/entities/practice.entity';
import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Tag } from '../../tags/entities/tag.entity';

@Entity()
export class RefVideo extends CoreEntity {
    @PrimaryGeneratedColumn({ name: 'rv_seq', type: 'bigint' })
    @IsNumberString()
    rvSeq: string;

    @Column({ name: 'rv_source', type: 'varchar', length: 50 })
    @IsEnum(RefVideoSourceCode)
    rvSource: string;

    @Column({ name: 'rv_source_title', type: 'varchar', length: 255 })
    @IsString()
    rvSourceTitle: string;

    @Column({ name: 'rv_source_account_name', type: 'varchar', length: 255 })
    @IsString()
    rvSourceAccountName: string;

    @Column({ name: 'rv_url', nullable: true, type: 'varchar', length: 255 })
    @IsUrl()
    rvUrl?: string;

    @Column({ name: 'rv_duration', type: 'time' })
    @IsString()
    rvDuration: string;

    @Column({ name: 'rv_difficulty', type: 'varchar', length: 50 })
    @IsEnum(RefVideoDifficultyCode)
    rvDifficulty: string;

    @Column({
        name: 'rv_song_name',
        nullable: true,
        type: 'varchar',
        length: 255,
    })
    @IsString()
    rvSongName?: string;

    @Column({
        name: 'rv_artist_name',
        nullable: true,
        type: 'varchar',
        length: 255,
    })
    @IsString()
    rvArtistName?: string;

    @OneToMany((type) => Analysis, (analysis) => analysis.refVideo)
    analyses: Analysis[];

    @OneToMany((type) => Practice, (practice) => practice.refVideo)
    practices: Practice[];

    @ManyToMany((type) => Tag)
    @JoinTable({
        name: 'ref_videos_tags',
        joinColumn: {
            name: 'rv_seq',
            referencedColumnName: 'rvSeq',
        },
        inverseJoinColumn: {
            name: 'tag_seq',
            referencedColumnName: 'tagSeq',
        },
    })
    tags: Tag[];
}
