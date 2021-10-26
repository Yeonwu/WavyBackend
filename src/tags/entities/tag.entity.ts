import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString, IsUrl } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Tag extends CoreEntity {
    @ApiProperty({ type: Number, description: '태그 ID' })
    @PrimaryGeneratedColumn({ name: 'tag_seq', type: 'bigint' })
    @IsNumberString()
    tagSeq: number;

    @ApiProperty({ type: String, description: '태그명' })
    @Column({ name: 'tag_name', type: 'varchar', length: 255 })
    @IsString()
    tagName: string;

    @ApiPropertyOptional({ type: String, description: '태그 대표 이미지 URL' })
    @Column({ name: 'tag_url', nullable: true, type: 'varchar', length: 255 })
    @IsUrl()
    @IsOptional()
    tagUrl?: string;
}
