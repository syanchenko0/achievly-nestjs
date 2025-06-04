import { ApiProperty } from '@nestjs/swagger';
import {
  ProjectEntity,
  ProjectTaskEntity,
} from '@/projects/entities/projects.entity';
import { TeamDto } from '@/teams/dto/team.dto';
import { ProjectColumn } from '@/projects/dto/swagger.dto';
import { MemberDto, ProjectRightsDto } from '@/teams/dto/swagger.dto';

class ProjectTaskDto {
  @ApiProperty({ type: Number, required: true, description: 'ID задачи' })
  id: number;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Наименование задачи',
  })
  name: string;

  @ApiProperty({
    type: String,
    required: false,
    nullable: true,
    description: 'Описание задачи',
  })
  description: string | null;

  @ApiProperty({
    type: ProjectColumn,
    required: true,
    nullable: false,
    description: 'Столбец задачи',
  })
  column: ProjectColumn;

  @ApiProperty({
    type: String,
    required: false,
    nullable: true,
    description: 'Приоритет задачи',
  })
  priority: string | null;

  @ApiProperty({
    type: MemberDto,
    required: true,
    nullable: false,
    description: 'Автор задачи',
  })
  author: MemberDto;

  @ApiProperty({
    type: MemberDto,
    required: false,
    nullable: true,
    description: 'Исполнитель задачи',
  })
  executor: MemberDto | null;

  @ApiProperty({
    type: String,
    required: false,
    nullable: true,
    description: 'Дедлайн задачи',
  })
  deadline_date: string | null;

  @ApiProperty({
    type: String,
    required: false,
    nullable: true,
    description: 'Дата завершения задачи',
  })
  done_date: string | null;

  constructor(task: ProjectTaskEntity) {
    this.id = task.id;
    this.name = task.name;
    this.description = task.description;
    this.column = task.column;
    this.priority = task.priority;
    this.author = task.author;
    this.executor = task.executor;
    this.deadline_date = task.deadline_date;
    this.done_date = task.done_date;
  }
}

class ProjectDto {
  @ApiProperty({ type: Number, required: true, description: 'ID проекта' })
  id: number;

  @ApiProperty({
    type: String,
    required: true,
    nullable: false,
    description: 'Название проекта',
  })
  name: string;

  @ApiProperty({
    type: ProjectColumn,
    required: true,
    nullable: false,
    isArray: true,
    description: 'Столбцы проекта',
  })
  columns: ProjectColumn[];

  @ApiProperty({
    type: TeamDto,
    required: true,
    description: 'Команда проекта',
  })
  team: TeamDto;

  @ApiProperty({
    type: ProjectRightsDto,
    required: false,
    description: 'Права пользователя в текущем проекте',
  })
  user_project_rights?: ProjectRightsDto;

  @ApiProperty({
    type: ProjectTaskDto,
    isArray: true,
    required: false,
    nullable: true,
    description: 'Команда проекта',
  })
  project_tasks: ProjectTaskDto[];

  constructor(project: ProjectEntity, user_id: number) {
    this.id = project.id;
    this.name = project.name;
    this.columns = project.columns.sort((a, b) => a.order - b.order);
    this.team = new TeamDto(project.team, user_id);
    this.user_project_rights = new TeamDto(
      project.team,
      user_id,
    ).user_projects_rights?.find((right) => right.project_id === project.id);
    this.project_tasks = (project?.project_tasks ?? [])
      .sort((a, b) => a.list_order - b.list_order)
      .map((project_task) => new ProjectTaskDto(project_task));
  }
}

export { ProjectDto, ProjectTaskDto };
