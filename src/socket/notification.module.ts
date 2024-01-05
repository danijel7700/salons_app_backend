import { Module, forwardRef } from '@nestjs/common';
import { ModelNames } from 'src/constants/modelNames';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationSchema } from 'src/database/entities/notification.schema';
import { NotificationService } from './notification.service';
import { UserModule } from 'src/services/User/modules/user.module';
import { GatewayModule } from './socket.gateway.module';
import { NotificationController } from './notification.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ModelNames.NOTIFICATION, schema: NotificationSchema },
    ]),
    forwardRef(() => UserModule),
    GatewayModule,
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
