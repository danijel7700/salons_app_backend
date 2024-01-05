import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { ModelNames } from 'src/constants/modelNames';
import { Notification } from 'src/database/entities/notification.schema';
import { UserService } from 'src/services/User/services/user.service';
import { SocketGateway } from './socket.gateway';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(ModelNames.NOTIFICATION)
    private notificationModel: mongoose.Model<Notification>,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private socketGateway: SocketGateway,
  ) {}

  async createNotification(notification: Notification, salonName: string) {
    const not = await this.notificationModel.create({
      ...notification,
      salonName,
    });
    this.socketGateway.onNewMessage({
      message: not,
      room: salonName,
    });
  }

  async getAllNotificationForUser(userId: string) {
    const salons = await this.userService.getUserSalonsNames(userId);

    const notifications = await this.notificationModel.find();

    console.log(salons, notifications);

    const result = await Promise.all(
      notifications.map(async (notification) => {
        if (salons.includes(notification.salonName)) {
          return notification;
        }
      }),
    );

    return result;
  }
}
