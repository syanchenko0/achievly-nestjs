import { Injectable } from '@nestjs/common';
import { NotificationsGateway } from '@/notifications/notifications.gateway';
import { NotificationBody } from '@/notifications/types/notifications.type';
import { Repository } from 'typeorm';
import { NotificationEntity } from '@/notifications/entities/notification.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async createNotification(notificationBody: NotificationBody) {
    return await this.notificationRepository.save(notificationBody);
  }

  sendNotification(notificationBody: NotificationBody) {
    return this.notificationsGateway.sendNotification(notificationBody);
  }
}
