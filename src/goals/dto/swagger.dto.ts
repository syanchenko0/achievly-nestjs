import { ApiProperty } from '@nestjs/swagger';
import {
  GoalCategoryEnum,
  GoalStatusEnum,
} from '@/goals/constants/goal.constant';

class GoalBodyTask {
  @ApiProperty({
    description: 'ID задачи',
    type: Number,
    required: false,
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Заголовок задачи',
    type: String,
    required: true,
    nullable: false,
    minLength: 1,
    example: 'Title',
  })
  title: string;

  @ApiProperty({
    description: 'Дата окончания задачи',
    type: String,
    required: false,
    example: '2025-02-02T21:00:00.000Z',
  })
  deadline_date?: string;

  @ApiProperty({
    description: 'Примечание задачи',
    type: String,
    required: false,
    example: 'Note',
  })
  note?: string;

  @ApiProperty({
    description: 'Дата выполнения задачи',
    type: String,
    required: false,
    example: '2025-02-02T21:00:00.000Z',
  })
  done_date?: string;
}

class CreateGoalBody {
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
    description: 'Дата окончания цели',
    type: String,
    required: false,
    example: '2025-02-02T21:00:00.000Z',
  })
  deadline_date?: string;

  @ApiProperty({
    description: 'Примечание к цели',
    type: String,
    required: false,
    example: 'Note',
  })
  note?: string;

  @ApiProperty({
    description: 'Задачи цели',
    type: GoalBodyTask,
    isArray: true,
    required: false,
    nullable: true,
  })
  tasks?: GoalBodyTask[];
}

class UpdateGoalBody {
  @ApiProperty({
    description: 'Заголовок цели',
    type: String,
    required: false,
    example: 'Goal title',
  })
  title?: string;

  @ApiProperty({
    description: 'Категория цели',
    type: String,
    required: false,
    example: 'education',
  })
  category?: GoalCategoryEnum;

  @ApiProperty({
    description: 'Статус цели',
    type: String,
    required: false,
    example: 'ongoing',
  })
  status?: GoalStatusEnum;

  @ApiProperty({
    description: 'Дата окончания цели',
    type: String,
    required: false,
    example: '2025-02-02T21:00:00.000Z',
  })
  deadline_date?: string;

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
  achieved_date?: string;

  @ApiProperty({
    description: 'Задачи цели',
    type: GoalBodyTask,
    isArray: true,
    required: false,
    nullable: true,
  })
  tasks?: GoalBodyTask[];
}

class UpdateTaskBody {
  @ApiProperty({
    description: 'ID задачи',
    type: Number,
    required: true,
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Заголовок задачи',
    type: String,
    required: true,
    example: 'Title',
  })
  title: string;

  @ApiProperty({
    description: 'Дата окончания задачи',
    type: String,
    required: false,
    nullable: true,
    example: '2025-02-02T21:00:00.000Z',
  })
  deadline_date?: string;

  @ApiProperty({
    description: 'Дата выполнения задачи',
    type: String,
    required: false,
    nullable: true,
    example: '2025-02-02T21:00:00.000Z',
  })
  done_date?: string;

  @ApiProperty({
    description: 'Примечание задачи',
    type: String,
    required: false,
    nullable: true,
    example: 'Note',
  })
  note?: string;
}

export { UpdateGoalBody, CreateGoalBody, UpdateTaskBody };
