import { TeamEntity } from '@/teams/entities/team.entity';
import { ApiProperty } from '@nestjs/swagger';
import { MemberDto } from '@/teams/dto/swagger.dto';

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
    type: MemberDto,
    required: true,
    isArray: true,
    description: 'Участники команды',
  })
  members: MemberDto[];

  constructor(team: TeamEntity, user_id: number) {
    this.id = team.id;
    this.name = team.name;
    this.user_role = team.members.find((member) => member.user.id === user_id)
      ?.role as string;
    this.members = team.members?.map((member) => new MemberDto(member));
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
