import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserDto } from '@/users/dto/user.dto';
import { MemberRoles } from '@/teams/types/teams.type';
import { TeamEntity } from '@/teams/entities/team.entity';
import { ProjectRightsDto } from '@/teams/dto/swagger.dto';

@Entity({ name: 'team_member' })
class MemberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'jsonb', nullable: false })
  user: UserDto;

  @Column({ type: 'enum', enum: MemberRoles, nullable: false })
  role: MemberRoles;

  @Column({ type: 'jsonb', nullable: true })
  projects_rights?: ProjectRightsDto[];

  @ManyToOne(() => TeamEntity, (team) => team.members)
  team: TeamEntity;
}

export { MemberEntity };
