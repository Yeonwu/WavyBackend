import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
        private readonly configService: ConfigService,
    ) {}
    private buildMember(newMemberInput: CreateMemberInput): Member {
        const newMember = this.members.create();
        const systemMbrSeq = this.configService.get('SYSTEM_MBR_SEQ');

        newMember.mbrEmail = newMemberInput.mbrEmail;
        newMember.mbrNickname = newMemberInput.mbrNickname;
        newMember.profileImageUrl = newMemberInput?.profileImageUrl;

        newMember.certificationMethodCode =
            newMemberInput.certificationMethodCode;

        newMember.privacyConsentCode = newMemberInput.privacyConsentCode;
        newMember.marketingConsentCode = newMemberInput.certificationMethodCode;

        newMember.videoOptionCode = newMemberInput.videoOptionCode;

        newMember.creatorSeq = systemMbrSeq;
        newMember.updaterSeq = systemMbrSeq;

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
            await this.saveMember(newMember);
            return { ok: true };
        } catch (error) {
            throw error;
        }
    }
}
