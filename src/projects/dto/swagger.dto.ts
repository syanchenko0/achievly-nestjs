import { ApiProperty } from '@nestjs/swagger';

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

export { CreateProjectBody };
