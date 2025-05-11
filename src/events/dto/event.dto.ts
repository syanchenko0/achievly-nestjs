import { ApiProperty } from '@nestjs/swagger';
import { EventEntity } from '@/events/entities/event.entity';

class EventDto {
  @ApiProperty({
    description: 'ID события',
    type: Number,
    required: true,
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Заголовок события',
    type: String,
    required: true,
    example: 'Title event',
  })
  title: string;

  @ApiProperty({
    description: 'Время начала события',
    type: Number,
    required: true,
    example: 'Note',
  })
  start_timestamp: number;

  @ApiProperty({
    description: 'Время окончания события',
    type: Number,
    required: true,
    example: 'Note',
  })
  end_timestamp: number;

  constructor(event: EventEntity) {
    this.id = event.id;
    this.title = event.title;
    this.start_timestamp = event.start_timestamp.getTime();
    this.end_timestamp = event.end_timestamp.getTime();
  }
}

export { EventDto };
