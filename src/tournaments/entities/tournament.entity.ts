import { PrimaryGeneratedColumn, Column, Entity, OneToMany } from 'typeorm';
import { Team } from './team.entity';

@Entity()
export class Tournament {
  @PrimaryGeneratedColumn()
  tournament_id: number;

  @Column()
  tournament_name: string;

  @Column({
    default: 'https://www.kadencewp.com/wp-content/uploads/2020/10/alogo-2.png',
  })
  tournament_logo: string;

  @Column({ default: 'Schedule' })
  tournament_schedule: string;

  @Column({ default: 'Group Stage' })
  current_stage: string;

  @Column({ default: 1 })
  current_day: number;

  @Column({ default: 1 })
  current_match: number;

  @OneToMany(() => Team, (team) => team.tournament, { cascade: true })
  team: Team[];
}
