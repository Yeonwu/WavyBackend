import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from 'src/members/entities/members.entity';
import { Repository } from 'typeorm';
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
        const { sum } = interval[0];
        if (!sum) {
            return '00:00:00';
        }
        const { hours, minutes, seconds } = interval[0]['sum'];
        const fhours = hours ? hours.toString().padStart(2, '0') : '00';
        const fminutes = minutes ? minutes.toString().padStart(2, '0') : '00';
        const fseconds = seconds ? seconds.toString().padStart(2, '0') : '00';
        return `${fhours}:${fminutes}:${fseconds}`;
    }

    async allPraticesTodaySum(
        authMember: Member,
    ): Promise<PracticesTodaySumOutput> {
        try {
            const result = await this.practices.manager.query(
                `SELECT SUM(pt_finished - pt_started) FROM practice
                WHERE practice.mbr_seq = ${authMember.mbrSeq}
                AND date_trunc('day', pt_started) = CURRENT_DATE
                `,
            );
            const practicesTodaySum = this.intervalToString(result);
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
            newPractice.member = authMember;
            newPractice.creatorSeq = authMember.mbrSeq;
            newPractice.updaterSeq = authMember.mbrSeq;
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
