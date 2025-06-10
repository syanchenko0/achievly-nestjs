import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { NotificationEntity } from '@/notifications/entities/notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateNotificationBody } from '@/notifications/dto/swagger.dto';
import { createNotificationSchema } from '@/notifications/schemas/notification.schema';
import { WRONG_BODY, WRONG_PARAMS } from '@/app/constants/error.constant';
import { UsersService } from '@/users/users.service';
import { NotificationDto } from '@/notifications/dto/notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
    private readonly usersService: UsersService,
  ) {}

  async createNotification(user_id: number, body: CreateNotificationBody) {
    const { error } = createNotificationSchema.safeParse(body);

    if (error) {
      throw new BadRequestException(WRONG_BODY);
    }

    const user = await this.usersService.getUserById(user_id);

    if (!user) {
      throw new BadRequestException(WRONG_PARAMS);
    }

    const notification = await this.notificationRepository.save({
      title: body.title,
      description: body?.description,
      accept: body?.accept,
      reject: body?.reject,
      user,
    });

    return new NotificationDto(notification);
  }
}
