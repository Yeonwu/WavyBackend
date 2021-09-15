import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
    CreateMemberInput,
    CreateMemberOutput,
} from './dtos/create-member.dto';
import {
    DeleteMemberOption,
    DeleteMemberOutput,
} from './dtos/delete-member.dto';
import {
    UpdateMemberInput,
    UpdateMemberOutput,
} from './dtos/update-member.dto';
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
    async getMemberByID(memberID: number): Promise<Member> {
        try {
            const member = await this.members.findOne(memberID);
            if (!member) {
                throw new HttpException(
                    '존재하지 않는 회원입니다.',
                    HttpStatus.NOT_FOUND,
                );
            }
            return member;
        } catch (error) {
            throw error;
        }
    }
    async updateMember(
        memberID: number,
        updateMemberInput: UpdateMemberInput,
    ): Promise<UpdateMemberOutput> {
        try {
            const member = await this.getMemberByID(memberID);
            const systemMbrSeq = this.configService.get('SYSTEM_MBR_SEQ');

            member.updaterSeq = systemMbrSeq;

            member.mbrNickname =
                updateMemberInput.mbrNickname ?? member.mbrNickname;
            member.videoOptionCode =
                updateMemberInput.videoOptionCode ?? member.videoOptionCode;
            member.profileImageUrl =
                updateMemberInput.profileImageUrl ?? member.profileImageUrl;

            await this.members.save(member);
            return { ok: true };
        } catch (error) {
            throw error;
        }
    }

    private async deleteMemberPrivateInfo(member) {
        member.mbrEmail = '_';
        member.mbrNickname = '_';
        member.profileImageUrl = '_';
        member.mbrDeleted = true;

        await this.members.save(member);
    }

    async deleteMember(
        memberID: number,
        options?: DeleteMemberOption,
    ): Promise<DeleteMemberOutput> {
        try {
            const member = await this.getMemberByID(memberID);

            if (member.mbrDeleted) {
                throw new HttpException(
                    '존재하지 않는 회원입니다.',
                    HttpStatus.NOT_FOUND,
                );
            }

            await this.deleteMemberPrivateInfo(member);

            if (options?.purge) {
                /**
                 * TODO:
                 * Delete Every related
                 *
                 *  - Analyses
                 *  - Practices
                 *  - ExpHistories
                 *  - Bookmarks
                 *
                 */

                return { ok: true };
            }

            return { ok: true };
        } catch (error) {
            throw error;
        }
    }
}
