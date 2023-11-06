export class CreateTeamDto {
  team_name: string;
  team_tag: string;
  team_logo: string;
  team_is_alive: boolean;
  team_players_alive: number;
  team_players_knocked: number;
  team_current_kills: number;
  team_current_position_points: number;
  team_current_total_points: number;
  team_is_winner: boolean;
  team_overall_kills: number;
  team_overall_position_points: number;
  team_overall_total_points: number;
  team_overall_chicken: number;
  tournament_id: number;
}
