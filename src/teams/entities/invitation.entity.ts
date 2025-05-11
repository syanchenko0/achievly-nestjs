import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '@/users/entities/user.entity';
import { TeamEntity } from '@/teams/entities/team.entity';

@Entity({ name: 'invitation_team' })
class InvitationTeamEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ generated: 'uuid' })
  accept_token: string;

  @Column({ generated: 'uuid' })
  reject_token: string;

  @ManyToOne(() => UserEntity, (user) => user.invitation_teams)
  user: UserEntity;

  @ManyToOne(() => TeamEntity, (team) => team.invitations)
  team: TeamEntity;
}

export { InvitationTeamEntity };
