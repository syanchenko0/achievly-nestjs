import { ApiProperty } from '@nestjs/swagger';

class CreateNotificationBody {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Заголовок уведомления',
  })
  title: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Описание уведомления',
  })
  description?: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Ссылка на принятие уведомления',
  })
  accept?: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Ссылка на отклонение уведомления',
  })
  reject?: string;
}

export { CreateNotificationBody };
