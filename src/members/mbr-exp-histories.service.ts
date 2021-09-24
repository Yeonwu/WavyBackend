import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    MemberExpHistoryLevelCode,
    MemberExpHistoryTierCode,
} from 'src/common/enums/code.enum';
import { Repository } from 'typeorm';
import {
    CreateMbrExpHistoryInput,
    CreateMbrExpHistoryOutput,
} from './dtos/create-mbr-exp-history';
import { GetMbrExpHistoryOutput } from './dtos/get-mbr-exp-history';
import { MemberExpHistory } from './entities/mbr-exp-history.entity';
import { Member } from './entities/members.entity';

@Injectable()
export class MbrExpHistoriesService {
    constructor(
        @InjectRepository(MemberExpHistory)
        private readonly mbrExpHistories: Repository<MemberExpHistory>,
    ) {}

    async createExpHistory(
        expHistoryInput: CreateMbrExpHistoryInput,
        member: Member,
    ): Promise<CreateMbrExpHistoryOutput> {
        try {
            const newExpHistory = await this.buildExpHistory(
                expHistoryInput.mehExpGained,
                member,
            );
            await this.mbrExpHistories.save(newExpHistory);
            return { ok: true, expHistory: newExpHistory };
        } catch (error) {
            console.log(error.message, error.stack);
            return { ok: false, error: '경험치를 등록하지 못했습니다.' };
        }
    }

    async getExpHistory(mbrSeq: string): Promise<GetMbrExpHistoryOutput> {
        try {
            const latestExpHistory = await this.getLatestExpHistory(mbrSeq);
            if (!latestExpHistory) {
                const EmptyExpHistory = this.buildEmptyExpHistory();
                return { ok: true, expHistory: EmptyExpHistory };
            }
            return { ok: true, expHistory: latestExpHistory };
        } catch (error) {
            console.log(error.message, error.stack);
            return { ok: false, error: '경험치 이력을 불러오지 못했습니다.' };
        }
    }

    private async getLatestExpHistory(mbrSeq: string) {
        return await this.mbrExpHistories
            .createQueryBuilder('meh')
            .select()
            .where('meh.mbr_seq = :mbrSeq', { mbrSeq })
            .orderBy('meh.created_date', 'DESC')
            .limit(1)
            .getOne();
    }

    private buildEmptyExpHistory(): MemberExpHistory {
        const EmptyExpHistory = new MemberExpHistory();
        EmptyExpHistory.mehExpAcc = 0;
        EmptyExpHistory.mehExpGained = 0;
        EmptyExpHistory.mehLevel = '' + MemberExpHistoryLevelCode.LV1;
        EmptyExpHistory.mehTier = '' + MemberExpHistoryTierCode.D;
        return EmptyExpHistory;
    }

    private async buildExpHistory(
        expGained: number,
        member: Member,
    ): Promise<MemberExpHistory> {
        const newExpHistory = this.mbrExpHistories.create();
        const { ok, expHistory } = await await this.getExpHistory(
            member.mbrSeq,
        );

        if (!ok) {
            return this.buildEmptyExpHistory();
        }
        newExpHistory.creatorSeq = member.mbrSeq;
        newExpHistory.updaterSeq = member.mbrSeq;
        newExpHistory.mehExpGained = expGained;
        newExpHistory.member = member;
        newExpHistory.mehExpAcc = expHistory.mehExpAcc + expGained;
        newExpHistory.mehLevel =
            '' + this.calculateLevel(newExpHistory.mehExpAcc);
        newExpHistory.mehTier =
            '' + this.calculateTier(newExpHistory.mehExpAcc);

        return newExpHistory;
    }

    private calculateLevel(exp: number): MemberExpHistoryLevelCode {
        if (exp > 10) {
            return MemberExpHistoryLevelCode.LV2;
        }
        return MemberExpHistoryLevelCode.LV1;
    }

    private calculateTier(exp: number): MemberExpHistoryTierCode {
        if (exp > 10) {
            return MemberExpHistoryTierCode.A;
        }
        return MemberExpHistoryTierCode.B;
    }
}
