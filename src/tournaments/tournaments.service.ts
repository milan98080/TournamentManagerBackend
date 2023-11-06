import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { Repository } from 'typeorm';
import { Tournament } from './entities/tournament.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Player } from './entities/player.entity';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { CurrentMatchDetailsDto } from './dto/current-match-details.dto';

@Injectable()
export class TournamentsService {
  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,

    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,

    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
  ) {}

  async create(createTournamentDto: CreateTournamentDto) {
    await this.tournamentRepository.save(createTournamentDto);
  }

  async createTeam(createTeamDto: CreateTeamDto) {
    const tournament = await this.tournamentRepository.findOneOrFail({
      where: { tournament_id: createTeamDto.tournament_id },
    });
    const team = new Team();
    team.team_name = createTeamDto.team_name;
    team.team_tag = createTeamDto.team_tag;
    team.team_logo = createTeamDto.team_logo;
    team.tournament = tournament;
    return await this.teamRepository.save(team);
  }

  async createPlayer(createPlayerDto: CreatePlayerDto) {
    const team = await this.teamRepository.findOneOrFail({
      where: { team_id: createPlayerDto.team_id },
    });
    const player = new Player();
    player.player_name = createPlayerDto.player_name;
    player.player_current_kills = createPlayerDto.player_current_kills;
    player.player_overall_kills = createPlayerDto.player_overall_kills;
    player.player_image = createPlayerDto.player_image;
    player.team = team;
    return await this.playerRepository.save(player);
  }

  async findAll() {
    return this.tournamentRepository.find();
  }

  async findAllTeams() {
    return this.tournamentRepository
      .createQueryBuilder('tournament')
      .leftJoinAndSelect('tournament.team', 'team')
      .getMany();
  }

  async findAllPlayers() {
    return this.tournamentRepository
      .createQueryBuilder('tournament')
      .leftJoinAndSelect('tournament.team', 'team')
      .leftJoinAndSelect('team.player', 'player')
      .getMany();
  }

  async findOne(tournament_id: number) {
    return this.tournamentRepository
      .createQueryBuilder('tournament')
      .leftJoinAndSelect('tournament.team', 'team')
      .leftJoinAndSelect('team.player', 'player') // Left join players from each team
      .where('tournament.tournament_id = :tournament_id', { tournament_id })
      .getOne();
  }

  async findOneTeam(team_id: number) {
    return this.teamRepository
      .createQueryBuilder('team')
      .leftJoinAndSelect('team.player', 'player')
      .where('team.team_id = :team_id', { team_id })
      .getOne();
  }

  async findOnePlayer(player_id: number) {
    return this.playerRepository
      .createQueryBuilder('player')
      .leftJoinAndSelect('player.team', 'team')
      .where('player.player_id = :player_id', { player_id })
      .getOne();
  }

  async update(
    tournament_id: number,
    updateTournamentDto: UpdateTournamentDto,
  ) {
    const tournament = await this.tournamentRepository.findOneBy({
      tournament_id,
    });
    tournament.tournament_name = updateTournamentDto.tournament_name;
    tournament.tournament_logo = updateTournamentDto.tournament_logo;
    tournament.tournament_schedule = updateTournamentDto.tournament_schedule;
    tournament.current_stage = updateTournamentDto.current_stage;
    tournament.current_day = updateTournamentDto.current_day;
    tournament.current_match = updateTournamentDto.current_match;
    await this.tournamentRepository.save(tournament);
  }

  async updateTeam(team_id: number, updateTeamDto: UpdateTeamDto) {
    const team = await this.teamRepository.findOneBy({
      team_id,
    });
    team.team_name = updateTeamDto.team_name;
    team.team_tag = updateTeamDto.team_tag;
    team.team_logo = updateTeamDto.team_logo;
    team.team_is_alive = updateTeamDto.team_is_alive;
    team.team_players_alive = updateTeamDto.team_players_alive;
    team.team_players_knocked = updateTeamDto.team_players_knocked;
    team.team_current_kills = updateTeamDto.team_current_kills;
    team.team_current_position_points =
      updateTeamDto.team_current_position_points;
    team.team_current_total_points = updateTeamDto.team_current_total_points;
    team.team_is_winner = updateTeamDto.team_is_winner;
    team.team_overall_kills = updateTeamDto.team_overall_kills;
    team.team_overall_position_points =
      updateTeamDto.team_overall_position_points;
    team.team_overall_total_points = updateTeamDto.team_overall_total_points;
    team.team_overall_chicken = updateTeamDto.team_overall_chicken;
    await this.teamRepository.save(team);
  }

  async updatePlayer(player_id: number, updatePlayerDto: UpdatePlayerDto) {
    const player = await this.playerRepository.findOneBy({
      player_id,
    });
    player.player_name = updatePlayerDto.player_name;
    player.player_current_kills = updatePlayerDto.player_current_kills;
    player.player_overall_kills = updatePlayerDto.player_overall_kills;
    player.player_image = updatePlayerDto.player_image;
    await this.playerRepository.save(player);
  }

  async remove(id: number) {
    // Find the tournament to be deleted
    const tournament = await this.tournamentRepository.findOne({
      where: {
        tournament_id: id,
      },
    });

    if (!tournament) {
      throw new NotFoundException('Tournament not found');
    }

    // Find all teams associated with the tournament using tournament_id
    const teams = await this.teamRepository.find({
      where: {
        tournament: tournament,
      },
    });

    // Loop through each team and delete its associated players
    for (const team of teams) {
      // Find all players associated with the team using team_id
      const players = await this.playerRepository.find({
        where: {
          team: team,
        },
      });

      // Delete all players associated with the team
      await this.playerRepository.remove(players);

      // Delete the team itself
      await this.teamRepository.remove(team);
    }

    // Finally, delete the tournament
    await this.tournamentRepository.remove(tournament);
  }

  async removeTeam(id: number) {
    // Find the team to be deleted
    const team = await this.teamRepository.findOne({
      where: {
        team_id: id,
      },
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    // Find all players associated with the tournament using team_id
    const players = await this.playerRepository.find({
      where: {
        team: team,
      },
    });

    // Delete all players associated with the team
    await Promise.all(
      players.map(async (player) => {
        await this.playerRepository.remove(player);
      }),
    );

    // Delete the team itself
    await this.teamRepository.remove(team);
  }

  async removePlayer(id: number) {
    await this.playerRepository.delete(id);
  }

  async currentMatchDetails(id: number): Promise<CurrentMatchDetailsDto[]> {
    const teams = await this.teamRepository
      .createQueryBuilder('team')
      .innerJoinAndSelect('team.tournament', 'tournament')
      .where('tournament.tournament_id = :id', { id })
      .getMany();
    return teams.map((team) => ({
      team_id: team.team_id,
      team_name: team.team_name,
      team_tag: team.team_tag,
      team_logo: team.team_logo,
      team_is_alive: team.team_is_alive,
      team_players_alive: team.team_players_alive,
      team_players_knocked: team.team_players_knocked,
      team_current_kills: team.team_current_kills,
      team_current_position_points: team.team_current_position_points,
      team_current_total_points: team.team_current_total_points,
      team_is_winner: team.team_is_winner,
      tournament_id: team.tournament.tournament_id,
      alive_color: this.calculateAliveColor(team),
      player1_status_color: this.calculatePlayerStatusColor(team, 1),
      player2_status_color: this.calculatePlayerStatusColor(team, 2),
      player3_status_color: this.calculatePlayerStatusColor(team, 3),
      player4_status_color: this.calculatePlayerStatusColor(team, 4),
    }));
  }

  private calculateAliveColor(team: Team): string {
    if (
      !team.team_is_alive ||
      team.team_players_alive === 0 ||
      team.team_players_alive - team.team_players_knocked <= 0
    ) {
      return 'red';
    } else {
      return 'green';
    }
  }

  private calculatePlayerStatusColor(team: Team, playerNumber: number): string {
    if (
      playerNumber <= team.team_players_alive &&
      team.team_is_alive &&
      team.team_players_alive - team.team_players_knocked > 0
    ) {
      const not_knocked = team.team_players_alive - team.team_players_knocked;
      if (playerNumber <= not_knocked) {
        return 'green';
      } else {
        return 'red';
      }
    } else {
      return 'gray';
    }
  }
}
