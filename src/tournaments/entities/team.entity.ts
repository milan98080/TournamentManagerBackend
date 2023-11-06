import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tournament } from './tournament.entity';
import { Player } from './player.entity';

@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  team_id: number;

  @Column()
  team_name: string;

  @Column()
  team_tag: string;

  @Column({
    default: 'https://www.kadencewp.com/wp-content/uploads/2020/10/alogo-2.png',
  })
  team_logo: string;

  @Column({
    default: true,
  })
  team_is_alive: boolean;

  @Column({
    default: 4,
  })
  team_players_alive: number;

  @Column({
    default: 0,
  })
  team_players_knocked: number;

  @Column({
    default: 0,
  })
  team_current_kills: number;

  @Column({
    default: 0,
  })
  team_current_position_points: number;

  @Column({
    default: 0,
  })
  team_current_total_points: number;

  @Column({
    default: false,
  })
  team_is_winner: boolean;

  @Column({
    default: 0,
  })
  team_overall_kills: number;

  @Column({
    default: 0,
  })
  team_overall_position_points: number;

  @Column({
    default: 0,
  })
  team_overall_total_points: number;

  @Column({
    default: 0,
  })
  team_overall_chicken: number;

  @ManyToOne(() => Tournament, (tournament) => tournament.team)
  tournament: Tournament;

  @OneToMany(() => Player, (player) => player.team, { cascade: true })
  player: Player[];
}
