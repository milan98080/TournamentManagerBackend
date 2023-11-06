import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Team } from './team.entity';

@Entity()
export class Player {
  @PrimaryGeneratedColumn()
  player_id: number;

  @Column()
  player_name: string;

  @Column({
    default: 0,
  })
  player_current_kills: number;

  @Column({
    default: true,
  })
  player_is_alive: boolean;

  @Column({
    default: false,
  })
  player_is_knocked: boolean;

  @Column({
    default: 0,
  })
  player_overall_kills: number;

  @Column({
    default: 'https://www.kadencewp.com/wp-content/uploads/2020/10/alogo-2.png',
  })
  player_image: string;

  @ManyToOne(() => Team, (team) => team.player)
  team: Team;
}
