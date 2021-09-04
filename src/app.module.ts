import { Module } from '@nestjs/common';
import { MembersModule } from './members/members.module';
import { PracticesModule } from './practices/practices.module';
import { AnalysesModule } from './analyses/analyses.module';
import { RefVideoesModule } from './ref-videoes/ref-videoes.module';
import { MembersRefVideoesModule } from './members-ref-videoes/members-ref-videoes.module';

@Module({
  imports: [MembersModule, PracticesModule, AnalysesModule, RefVideoesModule, MembersRefVideoesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
