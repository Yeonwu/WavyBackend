import { IsEnum } from 'class-validator';
import { IsBookmarkedCode } from 'src/common/enums/code.enum';
import { Member } from 'src/members/entities/members.entity';
import { RefVideo } from 'src/ref-videoes/entities/ref-video.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';

@Entity()
export class MemberRefVideo extends CoreEntity {
    @PrimaryGeneratedColumn()
    key: number;

    @ManyToOne((type) => Member, (member) => member.memberRefVideoes)
    member: Member;

    @ManyToOne((type) => RefVideo, (refVideo) => refVideo.memberRefVideoes)
    refVideo: RefVideo;

    @Column({ name: 'is_bookmarked' })
    @IsEnum(IsBookmarkedCode)
    isBookMarkedCode: string;
}
