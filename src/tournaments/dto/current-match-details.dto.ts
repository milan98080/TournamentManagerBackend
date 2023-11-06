export class CurrentMatchDetailsDto {
  readonly team_name: string;
  readonly team_tag: string;
  readonly team_logo: string;
  readonly team_is_alive: boolean;
  readonly team_players_alive: number;
  readonly team_players_knocked: number;
  readonly team_current_kills: number;
  readonly team_current_position_points: number;
  readonly team_current_total_points: number;
  readonly team_is_winner: boolean;
  readonly tournament_id: number;
  readonly alive_color: string;
  readonly player1_status_color: string;
  readonly player2_status_color: string;
  readonly player3_status_color: string;
  readonly player4_status_color: string;
}
