export class CreatePlayerDto {
  player_name: string;
  player_current_kills: number;
  player_overall_kills: number;
  player_is_alive: boolean;
  player_is_knocked: boolean;
  player_image: string;
  team_id: number;
}
