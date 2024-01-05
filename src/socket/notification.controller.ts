import { Controller, Get, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuardUser } from 'src/services/User/guards/jwt-auth.guard';
import { UserDecorator } from 'src/decorators/user.decorator';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @UseGuards(JwtAuthGuardUser)
  async getNotifications(@UserDecorator('id') id) {
    return this.notificationService.getAllNotificationForUser(id);
  }
}
