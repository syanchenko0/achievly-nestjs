import { ApiProperty } from '@nestjs/swagger';
import { ProjectEntity } from '@/projects/entities/project.entity';

class ProjectDto {
  @ApiProperty({ type: Number, required: true, description: 'ID проекта' })
  id: number;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Название проекта',
  })
  name: string;

  constructor(project: ProjectEntity) {
    this.id = project.id;
    this.name = project.name;
  }
}

export { ProjectDto };
