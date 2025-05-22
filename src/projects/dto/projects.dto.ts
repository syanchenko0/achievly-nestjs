import { ApiProperty } from '@nestjs/swagger';
import { ProjectEntity } from '@/projects/entities/project.entity';
import { TeamDto } from '@/teams/dto/team.dto';

class ProjectDto {
  @ApiProperty({ type: Number, required: true, description: 'ID проекта' })
  id: number;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Название проекта',
  })
  name: string;

  @ApiProperty({
    type: TeamDto,
    required: true,
    description: 'Команда проекта',
  })
  team: TeamDto;

  constructor(project: ProjectEntity, user_id: number) {
    this.id = project.id;
    this.name = project.name;
    this.team = new TeamDto(project.team, user_id);
  }
}

export { ProjectDto };
