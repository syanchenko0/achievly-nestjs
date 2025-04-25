import {
  GoalCategoryEnum,
  GoalStatusEnum,
} from '@/goals/constants/goal.constant';
import { ApiProperty } from '@nestjs/swagger';
import { GoalEntity } from '@/goals/entities/goal.entity';
import { TaskDto } from '@/goals/dto/task.dto';
import { UserEntity } from '@/users/entities/user.entity';

class GoalDto {
  @ApiProperty({
    description: 'ID цели',
    type: Number,
    required: true,
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Заголовок цели',
    type: String,
    required: true,
    example: 'Goal title',
  })
  title: string;

  @ApiProperty({
    description: 'Категория цели',
    type: String,
    required: true,
    example: 'education',
  })
  category: GoalCategoryEnum;

  @ApiProperty({
    description: 'Статус цели',
    type: String,
    required: true,
    example: 'ongoing',
  })
  status: GoalStatusEnum;

  @ApiProperty({
    description: 'Дата окончания цели',
    type: String,
    required: false,
    example: '2025-02-02T21:00:00.000Z',
  })
  deadlineDate?: string;

  @ApiProperty({
    description: 'Примечание к цели',
    type: String,
    required: false,
    example: 'Note',
  })
  note?: string;

  @ApiProperty({
    description: 'Дата выполнения цели',
    type: String,
    required: false,
    example: '2025-02-02T21:00:00.000Z',
  })
  achievedDate?: string;

  @ApiProperty({
    description: 'Задачи цели',
    type: TaskDto,
    isArray: true,
    required: false,
    nullable: true,
  })
  tasks?: TaskDto[];

  constructor(goal: GoalEntity) {
    this.id = goal.id;
    this.title = goal.title;
    this.category = goal.category;
    this.status = goal.status;
    this.deadlineDate = goal.deadlineDate;
    this.note = goal.note;
    this.achievedDate = goal.achievedDate;
    this.tasks = (goal.tasks || []).map((task) => new TaskDto(task));
  }
}

class CreateGoalDto {
  @ApiProperty({
    description: 'Заголовок цели',
    type: String,
    required: true,
    example: 'Goal title',
  })
  title: string;

  @ApiProperty({
    description: 'Категория цели',
    type: String,
    required: true,
    example: 'education',
  })
  category: GoalCategoryEnum;

  status: GoalStatusEnum;

  @ApiProperty({
    description: 'Дата окончания цели',
    type: String,
    required: false,
    example: '2025-02-02T21:00:00.000Z',
  })
  deadlineDate?: string;

  @ApiProperty({
    description: 'Примечание к цели',
    type: String,
    required: false,
    example: 'Note',
  })
  note?: string;

  user: UserEntity;

  @ApiProperty({
    description: 'Задачи цели',
    type: TaskDto,
    isArray: true,
    required: false,
    nullable: true,
  })
  tasks?: TaskDto[];

  constructor(goal: CreateGoalBody) {
    this.title = goal.title;
    this.category = goal.category;
    this.status = GoalStatusEnum.Ongoing;
    this.deadlineDate = goal.deadlineDate;
    this.note = goal.note;
    this.user = goal.user;
    this.tasks = goal.tasks;
  }
}

class UpdateGoalDto {
  @ApiProperty({
    description: 'Заголовок цели',
    type: String,
    required: false,
    example: 'Goal title',
  })
  title: string;

  @ApiProperty({
    description: 'Категория цели',
    type: String,
    required: false,
    example: 'education',
  })
  category: GoalCategoryEnum;

  @ApiProperty({
    description: 'Статус цели',
    type: String,
    required: false,
    example: 'ongoing',
  })
  status: GoalStatusEnum;

  @ApiProperty({
    description: 'Дата окончания цели',
    type: String,
    required: false,
    example: '2025-02-02T21:00:00.000Z',
  })
  deadlineDate?: string;

  @ApiProperty({
    description: 'Примечание к цели',
    type: String,
    required: false,
    example: 'Note',
  })
  note?: string;

  @ApiProperty({
    description: 'Дата выполнения цели',
    type: String,
    required: false,
    example: '2025-02-02T21:00:00.000Z',
  })
  achievedDate?: string;

  @ApiProperty({
    description: 'Задачи цели',
    type: TaskDto,
    isArray: true,
    required: false,
    nullable: true,
  })
  tasks?: TaskDto[];

  constructor(goal: UpdateGoalBody) {
    this.title = goal.title;
    this.category = goal.category;
    this.status = GoalStatusEnum.Ongoing;
    this.deadlineDate = goal.deadlineDate;
    this.note = goal.note;
    this.achievedDate = goal.achievedDate;
    this.tasks = goal.tasks;
  }
}

type CreateGoalBody = Pick<
  GoalEntity,
  'title' | 'category' | 'deadlineDate' | 'note' | 'user' | 'tasks'
>;

type UpdateGoalBody = Pick<
  GoalEntity,
  'title' | 'category' | 'deadlineDate' | 'note' | 'achievedDate' | 'tasks'
>;

export { GoalDto, CreateGoalDto, UpdateGoalDto };

export type { CreateGoalBody, UpdateGoalBody };
