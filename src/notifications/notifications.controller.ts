import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { BadRequest, ExtendedRequest } from '@/app/types/common.type';
import { CreateNotificationBody } from '@/notifications/dto/swagger.dto';
import { NotificationsService } from '@/notifications/notifications.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NotificationDto } from '@/notifications/dto/notification.dto';
import { JwtAuthGuard } from '@/auth/guards/auth.guard';

@ApiTags('Notifications')
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('/')
  @ApiOperation({
    summary: 'Create notification',
    operationId: 'createNotification',
  })
  @ApiResponse({ status: 200, type: NotificationDto })
  @ApiResponse({ status: 400, type: BadRequest })
  @ApiBody({ type: CreateNotificationBody })
  async createNotification(
    @Req()
    request: Omit<ExtendedRequest, 'body'> & { body: CreateNotificationBody },
  ) {
    const { user, body } = request;

    await this.notificationsService.createNotification(user.id, body);
  }
}
