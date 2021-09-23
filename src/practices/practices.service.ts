import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from 'src/members/entities/members.entity';
import { getRepository, Repository } from 'typeorm';
import {
    CreatePracticeInput,
    CreatePracticeOutput,
} from './dtos/create-practice.dto';
import { PracticesTodaySumOutput } from './dtos/practices-today-sum.dto';
import { Practice } from './entities/practice.entity';

@Injectable()
export class PracticesService {
    constructor(
        @InjectRepository(Practice)
        private readonly practices: Repository<Practice>,
    ) {}

    private intervalToString(interval: any): string {
        const { hours, minutes, seconds } = interval[0]['sum'];
        const fhours = hours ? hours.toString().padStart(2, '0') : '00';
        const fminutes = minutes ? minutes.toString().padStart(2, '0') : '00';
        const fseconds = seconds ? seconds.toString().padStart(2, '0') : '00';
        return `${fhours}:${fminutes}:${fseconds}`;
    }

    async allPraticesTodaySum(
        member: Member,
    ): Promise<PracticesTodaySumOutput> {
        try {
            const result = await this.practices.manager.query(
                `SELECT SUM(pt_finished - pt_started) FROM practice
                WHERE practice.mbr_seq = ${member ? member.mbrSeq : 1}
                AND date_trunc('day', pt_started) = CURRENT_DATE
                `,
            );
            const practicesTodaySum = this.intervalToString(result);
            if (!practicesTodaySum) {
                return {
                    ok: false,
                    error: '오늘 연습시간을 불러 올 수 없습니다',
                };
            }
            return {
                ok: true,
                practicesTodaySum,
            };
        } catch (error) {
            return {
                ok: false,
                error: '오늘 연습시간을 불러 올 수 없습니다',
            };
        }
    }

    async createPractice(
        authMember: Member,
        createPracticeInput: CreatePracticeInput,
    ): Promise<CreatePracticeOutput> {
        try {
            const newPractice = this.practices.create(createPracticeInput);
            // newPractice.member = authMember;
            const tempMember = getRepository(Member).create();
            tempMember.mbrEmail = 'example@gmail.com';
            tempMember.mbrNickname = 'example';
            tempMember.certificationMethodCode = 30001;
            tempMember.privacyConsentCode = 10001;
            tempMember.marketingConsentCode = 20001;
            tempMember.videoOptionCode = 40001;
            tempMember.creatorSeq = '1';
            tempMember.updaterSeq = '1';
            await getRepository(Member).save(tempMember);
            newPractice.member = tempMember;
            newPractice.creatorSeq = tempMember.mbrSeq;
            newPractice.updaterSeq = tempMember.mbrSeq;
            await this.practices.save(newPractice);
            return {
                ok: true,
                practice: newPractice,
            };
        } catch (error) {
            return {
                ok: false,
                error: '연습을 저장할 수 없습니다',
            };
        }
    }
}
