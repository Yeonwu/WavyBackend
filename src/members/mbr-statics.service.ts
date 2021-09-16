import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import {
    DancesGoodAt,
    DancesOften,
    GetStaticsOptions,
    GetStaticsOuput,
} from './dtos/get-statics.dto';
import { Member } from './entities/members.entity';
import { MembersService } from './members.service';

@Injectable()
export class MbrStaticsSerivce {
    private readonly manager: EntityManager;
    constructor(
        @InjectRepository(Member) private readonly members: Repository<Member>,
        private readonly memberService: MembersService,
    ) {
        this.manager = this.members.manager;
    }
    private intervalToString(interval: any): string {
        const { hours, minutes, seconds } = interval[0]['sum'];
        const fhours = hours ? hours.toString().padStart(2, '0') : '00';
        const fminutes = minutes ? minutes.toString().padStart(2, '0') : '00';
        const fseconds = seconds ? seconds.toString().padStart(2, '0') : '00';
        return `${fhours}:${fminutes}:${fseconds}`;
    }

    private async getTotalPracticeTime(memberSeq: number): Promise<string> {
        const getTotalPracticeTimeSQL = `
            SELECT SUM(pt_finished - pt_started) AS sum
            FROM practice
            WHERE mbr_seq = ${memberSeq}
        `;
        const totalPratcieTimeQueryResult = await this.manager.query(
            getTotalPracticeTimeSQL,
        );
        return this.intervalToString(totalPratcieTimeQueryResult);
    }

    private async getFavorateDancer(memberSeq: number): Promise<string> {
        const getFavorateDancerSQL = `
            SELECT rv.rv_artist_name, COUNT(rv.rv_artist_name)
            FROM practice AS pt
            JOIN ref_video AS rv
                ON rv.rv_seq = pt.rv_seq
            WHERE mbr_seq = ${memberSeq}
            GROUP BY rv.rv_artist_name
            ORDER BY count DESC
        `;
        const favorateDancerQueryResult = await this.manager.query(
            getFavorateDancerSQL,
        );
        const favorateDancer = favorateDancerQueryResult[0]['rv_artist_name'];
        return favorateDancer;
    }

    private async getDancesGoodAt(
        memberSeq: number,
        limit: number,
    ): Promise<DancesGoodAt[]> {
        const getDancesGoodAtSQL = `
        SELECT 
            rv.rv_song_name AS name, 
            ROUND(AVG(an.an_score)) AS score
        FROM analysis AS an
        JOIN ref_video AS rv
            ON an.rv_seq = rv.rv_seq
        WHERE an.mbr_seq = ${memberSeq}
        GROUP BY rv.rv_seq
        ORDER BY score DESC
        LIMIT ${limit}
        `;
        const getDancesGoodAtQueryResult = await this.manager.query(
            getDancesGoodAtSQL,
        );
        const dancesGoodAt: Array<DancesGoodAt> = getDancesGoodAtQueryResult;
        return dancesGoodAt;
    }

    private async getDancesOften(
        memberSeq: number,
        limit: number,
    ): Promise<DancesOften[]> {
        const getFavorateDancerSQL = `
            SELECT rv.rv_song_name AS name, COUNT(rv.rv_song_name) AS times
            FROM practice AS pt
            JOIN ref_video AS rv
                ON rv.rv_seq = pt.rv_seq
            WHERE mbr_seq = ${memberSeq}
            GROUP BY rv.rv_song_name
            ORDER BY times DESC
            LIMIT ${limit}
        `;
        const favorateDancerQueryResult = await this.manager.query(
            getFavorateDancerSQL,
        );

        const dancesOften: Array<DancesOften> = favorateDancerQueryResult;
        return dancesOften;
    }

    async getStatics(
        memberSeq: number,
        options?: GetStaticsOptions,
    ): Promise<GetStaticsOuput> {
        /**
         * Checks if member exists.
         * If not, it thorws 404 HttpException.
         */
        await this.memberService.getMemberBySeq(memberSeq);

        const totalPracticeTime: string = await this.getTotalPracticeTime(
            memberSeq,
        );

        const favorateDancer: string = await this.getFavorateDancer(memberSeq);

        const dancesGoodAt: Array<DancesGoodAt> = await this.getDancesGoodAt(
            memberSeq,
            options.dancesGoodAtLimit ?? 5,
        );

        const dancesOften: Array<DancesOften> = await this.getDancesOften(
            memberSeq,
            options.dancesOftenLimit ?? 5,
        );

        return {
            ok: true,
            statics: {
                totalPracticeTime,
                favorateDancer,
                dancesGoodAt,
                dancesOften,
            },
        };
    }
}
