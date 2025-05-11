import { ApiProperty } from '@nestjs/swagger';
import {
  GoalCategoryEnum,
  GoalStatusEnum,
} from '@/goals/constants/goal.constant';
import { TaskDto } from '@/goals/dto/task.dto';

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
    type: TaskDto,
    isArray: true,
    required: false,
    nullable: true,
  })
  tasks?: TaskDto[];
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
    type: TaskDto,
    isArray: true,
    required: false,
    nullable: true,
  })
  tasks?: TaskDto[];
}

export { UpdateGoalBody, CreateGoalBody };
