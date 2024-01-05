import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './services/User/modules/user.module';
import { SalonModule } from './services/Salon/modules/salon.module';
import { AdminModule } from './services/Admin/modules/admin.module';
import { ServiceModule } from './services/Service/modules/service.module';
import { AppointmentModule } from './services/Appointment/module/appointment.module';
import { GatewayModule } from './socket/socket.gateway.module';
import { NotificationModule } from './socket/notification.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    SalonModule,
    AdminModule,
    ServiceModule,
    AppointmentModule,
    GatewayModule,
    NotificationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
