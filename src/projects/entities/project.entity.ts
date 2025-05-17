import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '@/users/entities/user.entity';
import { TeamEntity } from '@/teams/entities/team.entity';

@Entity()
class ProjectEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => TeamEntity, (team) => team.projects)
  team: TeamEntity;

  @ManyToOne(() => UserEntity, (user) => user.projects)
  user: UserEntity;
}

export { ProjectEntity };
