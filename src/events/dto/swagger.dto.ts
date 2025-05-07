import { ApiProperty } from '@nestjs/swagger';

class CreateEventBody {
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
  startTimestamp: number;

  @ApiProperty({
    description: 'Время окончания события',
    type: Number,
    required: true,
    example: 'Note',
  })
  endTimestamp: number;
}

class UpdateEventBody {
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
  startTimestamp: number;

  @ApiProperty({
    description: 'Время окончания события',
    type: Number,
    required: true,
    example: 'Note',
  })
  endTimestamp: number;
}

export { CreateEventBody, UpdateEventBody };
