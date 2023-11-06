import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from './entities/team.entity';
import { CreatePlayerDto } from './dto/create-player.dto';
import { Player } from './entities/player.entity';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { extname } from 'path';

@Controller('tournaments')
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  @Post()
  async create(@Body() createTournamentDto: CreateTournamentDto) {
    return this.tournamentsService.create(createTournamentDto);
  }

  @Post('team')
  async createTeam(@Body() createTeamDto: CreateTeamDto): Promise<Team> {
    return await this.tournamentsService.createTeam(createTeamDto);
  }

  @Post('player')
  async createPlayer(
    @Body() createPlayerDto: CreatePlayerDto,
  ): Promise<Player> {
    return await this.tournamentsService.createPlayer(createPlayerDto);
  }

  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
      limits: { fileSize: 100 * 1024 * 1024 },
    }),
  )
  handleUpload(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return { filename: file.filename };
  }

  @Get()
  async findAll() {
    return this.tournamentsService.findAll();
  }

  @Get('teams')
  async findAllTeams() {
    return this.tournamentsService.findAllTeams();
  }

  @Get('players')
  async findAllPlayers() {
    return this.tournamentsService.findAllPlayers();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.tournamentsService.findOne(+id);
  }

  @Get('team/:id')
  async findOneTeam(@Param('id') id: string) {
    return this.tournamentsService.findOneTeam(+id);
  }

  @Get('player/:id')
  async findOnePlayer(@Param('id') id: string) {
    return this.tournamentsService.findOnePlayer(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTournamentDto: UpdateTournamentDto,
  ) {
    return this.tournamentsService.update(+id, updateTournamentDto);
  }

  @Patch('team/:id')
  async updateTeam(
    @Param('id') id: string,
    @Body() updateTeamDto: UpdateTeamDto,
  ) {
    return this.tournamentsService.updateTeam(+id, updateTeamDto);
  }

  @Patch('player/:id')
  async updatePlayer(
    @Param('id') id: string,
    @Body() updatePlayerDto: UpdatePlayerDto,
  ) {
    return this.tournamentsService.updatePlayer(+id, updatePlayerDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.tournamentsService.remove(+id);
  }

  @Delete('team/:id')
  async removeTeam(@Param('id') id: string) {
    return this.tournamentsService.removeTeam(+id);
  }

  @Delete('player/:id')
  async removePlayer(@Param('id') id: string) {
    return this.tournamentsService.removePlayer(+id);
  }

  @Get('production/:id')
  async currentMatchDetails(@Param('id') id: string) {
    return this.tournamentsService.currentMatchDetails(+id);
  }
}
