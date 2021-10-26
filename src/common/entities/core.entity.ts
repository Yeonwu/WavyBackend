import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumberString } from 'class-validator';
import { Column, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';

@Entity()
export class CoreEntity {
    @ApiProperty({ type: Date, description: '생성날짜' })
    @CreateDateColumn({ name: 'created_date' })
    createdDate: Date;

    @ApiProperty({ type: String, description: '생성유저 ID' })
    @Column({ name: 'creator_seq', type: 'bigint' })
    @IsNumberString()
    creatorSeq: string;

    @ApiProperty({ type: Date, description: '수정날짜' })
    @UpdateDateColumn({ name: 'updated_date' })
    @IsDate()
    updatedDate: Date;

    @ApiProperty({ type: String, description: '수정유저 ID' })
    @Column({ name: 'updater_seq', type: 'bigint' })
    @IsNumberString()
    updaterSeq: string;
}
