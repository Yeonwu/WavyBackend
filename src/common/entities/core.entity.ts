import { IsDate, IsNumberString } from 'class-validator';
import { Column, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';

@Entity()
export class CoreEntity {
    @CreateDateColumn({ name: 'created_date' })
    createdDate: Date;

    @Column({ name: 'creator_seq', type: 'bigint' })
    @IsNumberString()
    creatorSeq: string;

    @UpdateDateColumn({ name: 'updated_date' })
    @IsDate()
    updatedDate: Date;

    @Column({ name: 'updater_seq', type: 'bigint' })
    @IsNumberString()
    updaterSeq: string;
}
