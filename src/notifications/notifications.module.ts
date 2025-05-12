import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from '@/notifications/entities/notification.entity';
import { NotificationsGateway } from './notifications.gateway';
import { UsersModule } from '@/users/users.module';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    JwtModule,
    TypeOrmModule.forFeature([NotificationEntity]),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsGateway],
  exports: [NotificationsService],
})
export class NotificationsModule {}
