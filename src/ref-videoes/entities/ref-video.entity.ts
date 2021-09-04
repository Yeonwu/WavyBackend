import { IsEnum, IsString, IsUrl } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import {
    RefVideoDifficultyCode,
    RefVideoSourceCode,
} from 'src/common/enums/code.enum';
import { Practice } from 'src/practices/entities/practice.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RefVideo extends CoreEntity {
    @PrimaryGeneratedColumn({ name: 'rv_seq', type: 'bigint' })
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

    @Column({ name: 'rv_genre', nullable: true, type: 'varchar', length: 255 })
    @IsString()
    rvGenre?: string;

    @OneToMany((type) => Analysis, (analysis) => analysis.refVideo)
    analyses: Analysis[];

    @OneToMany((type) => Practice, (practice) => practice.refVideo)
    practices: Practice[];

    @OneToMany(
        (type) => MemberRefVideo,
        (memberRefVideo) => memberRefVideo.refVideo,
    )
    memberRefVideoes: MemberRefVideo[];
}
