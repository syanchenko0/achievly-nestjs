import { ApiProperty } from '@nestjs/swagger';

class CreateEventBody {
  @ApiProperty({
    description: 'Заголовок события',
    type: String,
    required: true,
    nullable: false,
    example: 'Title event',
  })
  title: string;

  @ApiProperty({
    description: 'Время начала события',
    type: Number,
    required: true,
    nullable: false,
    example: 'Note',
  })
  start_timestamp: number;

  @ApiProperty({
    description: 'Время окончания события',
    type: Number,
    required: true,
    nullable: false,
    example: 'Note',
  })
  end_timestamp: number;
}

class CreateEventsBody {
  @ApiProperty({
    description: 'Список событий',
    type: CreateEventBody,
    isArray: true,
    required: true,
  })
  events: CreateEventBody[];
}

class UpdateEventBody {
  @ApiProperty({
    description: 'Заголовок события',
    type: String,
    required: true,
    nullable: false,
    example: 'Title event',
  })
  title: string;

  @ApiProperty({
    description: 'Время начала события',
    type: Number,
    required: true,
    nullable: false,
    example: 'Note',
  })
  start_timestamp: number;

  @ApiProperty({
    description: 'Время окончания события',
    type: Number,
    required: true,
    nullable: false,
    example: 'Note',
  })
  end_timestamp: number;
}

export { CreateEventBody, CreateEventsBody, UpdateEventBody };
