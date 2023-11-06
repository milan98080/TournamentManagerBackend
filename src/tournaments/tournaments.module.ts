import { Module } from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { TournamentsController } from './tournaments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tournament } from './entities/tournament.entity';
import { Team } from './entities/team.entity';
import { Player } from './entities/player.entity';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tournament, Team, Player]),
    MulterModule.register({
      dest: './uploads', // Destination directory for uploaded files
    }),
  ],
  controllers: [TournamentsController],
  providers: [TournamentsService],
})
export class TournamentsModule {}
