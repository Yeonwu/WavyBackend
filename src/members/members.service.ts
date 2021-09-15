import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMemberInput } from './dtos/create-member.dto';
import { Member } from './entities/members.entity';

@Injectable()
export class MembersService {
    constructor(
        @InjectRepository(Member)
        private readonly member: Repository<Member>,
    ) {}
}
