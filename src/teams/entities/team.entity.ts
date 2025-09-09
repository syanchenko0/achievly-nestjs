import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '@/users/entities/user.entity';
import { MemberEntity } from '@/teams/entities/member.entity';
import { ProjectEntity } from '@/projects/entities/projects.entity';

@Entity()
class TeamEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ generated: 'uuid' })
  join_access_token: string;

  @OneToMany(() => MemberEntity, (member) => member.team, {
    cascade: true,
  })
  members: MemberEntity[];

  @OneToMany(() => ProjectEntity, (project) => project.team, {
    cascade: true,
  })
  projects?: ProjectEntity[];

  @ManyToMany(() => UserEntity, (user) => user.teams)
  @JoinTable()
  users: UserEntity[];
}

export { TeamEntity };
