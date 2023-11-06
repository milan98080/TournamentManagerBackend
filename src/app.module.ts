import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { TournamentsModule } from './tournaments/tournaments.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    TournamentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
