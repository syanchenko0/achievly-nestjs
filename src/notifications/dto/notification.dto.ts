import { ApiProperty } from '@nestjs/swagger';
import { NotificationEntity } from '@/notifications/entities/notification.entity';

class NotificationDto {
  @ApiProperty({ type: Number, description: 'ID уведомления', required: true })
  id: number;

  @ApiProperty({
    type: String,
    description: 'Заголовок уведомления',
    required: true,
  })
  title: string;

  @ApiProperty({
    type: String,
    description: 'Описание уведомления',
    required: false,
  })
  description?: string;

  @ApiProperty({
    type: String,
    description: 'Ссылка на принятие уведомления',
    required: false,
  })
  accept?: string;

  @ApiProperty({
    type: String,
    description: 'Ссылка на отклонение уведомления',
    required: false,
  })
  reject?: string;

  constructor(notification: NotificationEntity) {
    this.id = notification.id;
    this.title = notification.title;
    this.description = notification.description;
    this.accept = notification.accept;
    this.reject = notification.reject;
  }
}

export { NotificationDto };
