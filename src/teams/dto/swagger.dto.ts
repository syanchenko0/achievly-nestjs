import { ApiProperty } from '@nestjs/swagger';
import { MemberRoles } from '@/teams/types/teams.type';
import { UserDto } from '@/users/dto/user.dto';
import { UserEntity } from '@/users/entities/user.entity';

class CreateTeamBody {
  @ApiProperty({
    type: String,
    required: true,
    nullable: false,
    minLength: 1,
    description: 'Наименование команды',
  })
  name: string;
}

class ProjectRightsDto {
  @ApiProperty({ type: Number, required: true, description: 'ID проекта' })
  project_id: number;

  @ApiProperty({ type: Boolean, required: true, description: 'Создание' })
  create: boolean;

  @ApiProperty({ type: Boolean, required: true, description: 'Чтение' })
  read: boolean;

  @ApiProperty({ type: Boolean, required: true, description: 'Обновление' })
  update: boolean;

  @ApiProperty({ type: Boolean, required: true, description: 'Удаление' })
  delete: boolean;
}

class UpdateTeamMemberBody {
  @ApiProperty({
    type: String,
    required: true,
    nullable: false,
    minLength: 1,
    description: 'Роль участника команды',
  })
  role: string;

  @ApiProperty({
    type: ProjectRightsDto,
    isArray: true,
    required: false,
    description: 'Массив прав в проектах',
  })
  projects_rights?: ProjectRightsDto[];
}

class MemberDto {
  @ApiProperty({
    type: Number,
    required: true,
    description: 'ID участника',
  })
  id: number;

  @ApiProperty({
    type: UserDto,
    required: true,
    description: 'Данные пользователя',
  })
  user: UserDto;

  @ApiProperty({ type: String, required: true, description: 'Роль в команде' })
  role: MemberRoles;

  constructor(member: MemberDto) {
    this.id = member.id;
    this.user = new UserDto(member.user as UserEntity);
    this.role = member.role;
  }
}

export { CreateTeamBody, UpdateTeamMemberBody, MemberDto, ProjectRightsDto };
