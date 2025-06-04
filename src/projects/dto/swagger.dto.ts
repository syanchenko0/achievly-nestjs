import { ApiProperty } from '@nestjs/swagger';

class ProjectColumn {
  @ApiProperty({
    type: String,
    required: true,
    nullable: false,
    description: 'ID столбца проекта',
  })
  id: string;

  @ApiProperty({
    type: String,
    required: true,
    nullable: false,
    description: 'Название столбца',
  })
  name: string;

  @ApiProperty({
    type: Number,
    required: true,
    nullable: false,
    description: 'Порядковый номер столбца',
  })
  order: number;

  @ApiProperty({
    type: Boolean,
    required: false,
    nullable: true,
    description: 'Признак удаления столбца',
  })
  is_removable?: boolean | null;

  @ApiProperty({
    type: Boolean,
    required: false,
    nullable: true,
    description: 'Признак разрешения создания задач в столбце',
  })
  is_task_creation_allowed?: boolean;

  @ApiProperty({
    type: Boolean,
    required: false,
    nullable: true,
    description: 'Признак столбца финального этапа',
  })
  is_final_stage?: boolean | null;
}

class CreateProjectColumnBody {
  @ApiProperty({
    type: String,
    required: true,
    nullable: false,
    description: 'Название столбца',
  })
  name: string;

  @ApiProperty({
    type: Boolean,
    required: false,
    nullable: true,
    description: 'Признак удаления столбца',
  })
  is_removable?: boolean | null;

  @ApiProperty({
    type: Boolean,
    required: false,
    nullable: true,
    description: 'Признак разрешения создания задач в столбце',
  })
  is_task_creation_allowed?: boolean;

  @ApiProperty({
    type: Boolean,
    required: false,
    nullable: true,
    description: 'Признак столбца финального этапа',
  })
  is_final_stage?: boolean | null;
}

class CreateProjectBody {
  @ApiProperty({
    type: String,
    required: true,
    nullable: false,
    minLength: 1,
    description: 'Название проекта',
  })
  name: string;
}

class UpdateProjectBody {
  @ApiProperty({
    type: String,
    required: false,
    nullable: true,
    description: 'Название проекта',
  })
  name: string | null;

  @ApiProperty({
    type: ProjectColumn,
    required: false,
    nullable: true,
    isArray: true,
    description: 'Описание проекта',
  })
  columns: ProjectColumn[] | null;
}

class ShortInfoProjectDto {
  @ApiProperty({
    type: Number,
    required: true,
    nullable: false,
    description: 'ID проекта',
  })
  id: number;

  @ApiProperty({
    type: String,
    required: true,
    nullable: false,
    description: 'Название проекта',
  })
  name: string;
}

class CreateProjectTaskBody {
  @ApiProperty({
    type: String,
    required: true,
    nullable: false,
    minLength: 1,
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
    type: Number,
    required: false,
    nullable: true,
    description: 'ID исполнителя задачи',
  })
  executor_member_id: number | null;

  @ApiProperty({
    type: String,
    required: false,
    nullable: true,
    description: 'Дедлайн задачи',
  })
  deadline_date: string | null;
}

class UpdateProjectTaskBody {
  @ApiProperty({
    type: String,
    required: false,
    nullable: true,
    description: 'Наименование задачи',
  })
  name: string | null;

  @ApiProperty({
    type: String,
    required: false,
    nullable: true,
    description: 'Описание задачи',
  })
  description: string | null;

  @ApiProperty({
    type: ProjectColumn,
    required: false,
    nullable: true,
    description: 'Столбец задачи',
  })
  column: ProjectColumn | null;

  @ApiProperty({
    type: String,
    required: false,
    nullable: true,
    description: 'Приоритет задачи',
  })
  priority: string | null;

  @ApiProperty({
    type: Number,
    required: false,
    nullable: true,
    description: 'ID исполнителя задачи',
  })
  executor_member_id: number | null;

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
}

class UpdateProjectTaskListOrderBody {
  @ApiProperty({
    description: 'ID задачи',
    type: Number,
    required: true,
  })
  id: number;

  @ApiProperty({
    description: 'Порядок задачи в списке',
    type: Number,
    required: true,
  })
  list_order: number;
}

export {
  CreateProjectBody,
  ShortInfoProjectDto,
  ProjectColumn,
  CreateProjectColumnBody,
  CreateProjectTaskBody,
  UpdateProjectBody,
  UpdateProjectTaskBody,
  UpdateProjectTaskListOrderBody,
};
