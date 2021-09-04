import { IsDate, IsNumber } from 'class-validator';
import { Column, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';

@Entity()
export class CoreEntity {
    constructor(private readonly prefix: string) {}

    @CreateDateColumn({ name: 'created_date' })
    createdDate: Date;

    @Column({ name: 'creator_seq', type: 'bigint' })
    @IsNumber()
    creatorSeq: string;

    @UpdateDateColumn({ name: 'updated_date', nullable: true })
    @IsDate()
    updatedDate: Date;

    @Column({ name: 'updater_seq', type: 'bigint', nullable: true })
    @IsNumber()
    updaterSeq: string;
}
