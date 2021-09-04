import { IsDate, IsNumber } from 'class-validator';
import { Column, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';

@Entity()
export class CoreEntity {
  constructor(private readonly prefix: string) {}

  @CreateDateColumn({ name: 'created_date' })
  @IsDate()
  createdDate: Date;

  @Column({ name: 'creator_seq' })
  @IsNumber()
  creatorSeq: number;

  @UpdateDateColumn({ name: 'updated_date', nullable: true })
  @IsDate()
  updatedDate: Date;

  @Column({ name: 'updater_seq', nullable: true })
  @IsNumber()
  updaterSeq: number;
}
