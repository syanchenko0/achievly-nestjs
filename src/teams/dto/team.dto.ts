import { TeamEntity } from '@/teams/entities/team.entity';
import { ApiProperty } from '@nestjs/swagger';
import { MemberDto, ProjectRightsDto } from '@/teams/dto/swagger.dto';

class TeamDto {
  @ApiProperty({
    type: Number,
    required: true,
    description: 'ID команды',
  })
  id: number;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Наименование команды',
  })
  name: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Роль пользователя в команде',
  })
  user_role: string;

  @ApiProperty({
    type: ProjectRightsDto,
    required: false,
    isArray: true,
    description: 'Массив прав в проектах',
  })
  user_projects_rights?: ProjectRightsDto[];

  @ApiProperty({
    type: MemberDto,
    required: true,
    isArray: true,
    description: 'Участники команды',
  })
  members: MemberDto[];

  constructor(team: TeamEntity, user_id: number) {
    const member = team.members.find((member) => member.user.id === user_id);
    const role = member?.role;

    this.id = team.id;
    this.name = team.name;
    this.user_role = role as string;
    this.user_projects_rights = member?.projects_rights?.filter(
      (right) => right.read,
    ) as ProjectRightsDto[];
    this.members = team.members
      ?.sort((a, b) => a.id - b.id)
      ?.map((member) => new MemberDto(member, user_id, role));
  }
}

class TeamGeneralInfoDto {
  @ApiProperty({
    type: Number,
    required: true,
    description: 'ID команды',
  })
  id: number;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Наименование команды',
  })
  name: string;

  @ApiProperty({
    type: Number,
    required: true,
    description: 'Количество участников команды',
  })
  members_length: number;

  constructor(team: TeamEntity) {
    this.id = team.id;
    this.name = team.name;
    this.members_length = team.members.length;
  }
}

export { TeamDto, TeamGeneralInfoDto };
