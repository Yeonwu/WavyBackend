import { CoreEntity } from 'src/common/entities/core.entity';
import { Member } from 'src/members/entities/members.entity';
import { Column, Entity, JoinColumn, ManyToOne, RelationId } from 'typeorm';

@Entity()
export class Analysis extends CoreEntity {
    @ManyToOne((type) => Member, (member) => member.analyses)
    @JoinColumn({ name: 'mbr_seq' })
    member: Member;

    @RelationId((analysis: Analysis) => analysis.member)
    memberId: number;
}
