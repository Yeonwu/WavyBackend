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
    private buildMember(newMemberInput: CreateMemberInput) {
        try {
            const newMember = this.members.create();
            const systemMbrSeq = this.configService.get('SYSTEM_MBR_SEQ');

            newMember.mbrEmail = newMemberInput.mbrEmail;
            newMember.mbrNickname = newMemberInput.mbrNickname;
            newMember.profileImageUrl = newMemberInput?.profileImageUrl;
            newMember.certificationMethodCode =
                newMemberInput.certificationMethodCode;
            newMember.marketingConsentCode =
                newMemberInput.certificationMethodCode;
            newMember.privacyConsentCode = newMemberInput.privacyConsentCode;
            newMember.videoOptionCode = newMemberInput.videoOptionCode;
            newMember.creatorSeq = systemMbrSeq;

            return newMember;
        } catch (error) {}
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
