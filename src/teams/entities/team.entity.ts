import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '@/users/entities/user.entity';
import { InvitationTeamEntity } from '@/teams/entities/invitation.entity';

@Entity()
class TeamEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column(() => UserEntity)
  created_by: UserEntity;

  @ManyToMany(() => UserEntity, (user) => user.teams)
  @JoinTable()
  users: UserEntity[];

  @OneToMany(
    () => InvitationTeamEntity,
    (invitationTeam) => invitationTeam.team,
  )
  invitations: InvitationTeamEntity[];
}

export { TeamEntity };
