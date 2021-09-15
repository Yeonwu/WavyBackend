import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
    CreateMemberInput,
    CreateMemberOutput,
} from './dtos/create-member.dto';
import { Member } from './entities/members.entity';

@Injectable()
export class MembersService {
    constructor(
        @InjectRepository(Member)
        private readonly members: Repository<Member>,
    ) {}
    private buildMember(newMemberInput: CreateMemberInput) {
        const newMember = this.members.create();

        newMember.mbrNickname = newMemberInput.mbrNickname;
        newMember.profileImageUrl = newMemberInput?.profileImageUrl;
        newMember.certificationMethodCode =
            newMemberInput.certificationMethodCode;
        newMember.marketingConsentCode = newMemberInput.certificationMethodCode;
        newMember.privacyConsentCode = newMemberInput.privacyConsentCode;
        newMember.videoOptionCode = newMemberInput.videoOptionCode;

        return newMember;
    }
    private async saveMember(newMember: Member) {
        await this.members.save(newMember);
    }
    async createMember(
        newMemberInput: CreateMemberInput,
    ): Promise<CreateMemberOutput> {
        try {
            const newMember = this.buildMember(newMemberInput);
            this.saveMember(newMember);
            return { success: true };
        } catch (error) {
            console.error(error.message);

            return {
                success: false,
                error: '회원 등록에 실패하였습니다',
            };
        }
    }
}
