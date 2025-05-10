import { UserDto } from '@/users/dto/user.dto';
import { TeamEntity } from '@/teams/entities/team.entity';
import { ApiProperty } from '@nestjs/swagger';

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
    type: UserDto,
    required: true,
    description: 'Создатель команды',
  })
  created_by: UserDto;

  @ApiProperty({
    type: UserDto,
    required: true,
    isArray: true,
    description: 'Участники команды',
  })
  users: UserDto[];

  constructor(team: TeamEntity) {
    this.id = team.id;
    this.name = team.name;
    this.created_by = new UserDto(team.created_by);
    this.users = team.users?.map((user) => new UserDto(user));
  }
}

export { TeamDto };
