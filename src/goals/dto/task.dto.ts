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
    example: '2025-02-02T21:00:00.000Z',
  })
  deadlineDate?: string;

  @ApiProperty({
    description: 'Примечание задачи',
    type: String,
    example: 'Note',
  })
  note?: string;

  @ApiProperty({
    description: 'Дата выполнения задачи',
    type: String,
    example: '2025-02-02T21:00:00.000Z',
  })
  doneDate?: string;

  constructor(task: TaskEntity) {
    this.id = task.id;
    this.title = task.title;
    this.deadlineDate = task?.deadlineDate;
    this.note = task?.note;
    this.doneDate = task?.doneDate;
  }
}

export { TaskDto };
