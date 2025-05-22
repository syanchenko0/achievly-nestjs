import { ApiProperty } from '@nestjs/swagger';
import { TaskEntity } from '@/goals/entities/task.entity';

class TaskDto {
  @ApiProperty({
    description: 'ID задачи',
    type: Number,
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Заголовок задачи',
    type: String,
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
    description: 'Примечание задачи',
    type: String,
    required: false,
    nullable: true,
    example: 'Note',
  })
  note?: string;

  @ApiProperty({
    description: 'Дата выполнения задачи',
    type: String,
    required: false,
    nullable: true,
    example: '2025-02-02T21:00:00.000Z',
  })
  done_date?: string;

  constructor(task: TaskEntity) {
    this.id = task.id;
    this.title = task.title;
    this.deadline_date = task?.deadline_date;
    this.note = task?.note;
    this.done_date = task?.done_date;
  }
}

export { TaskDto };
