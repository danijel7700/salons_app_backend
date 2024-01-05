import { Module, forwardRef } from '@nestjs/common';
import { SalonModule } from '../../Salon/modules/salon.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ModelNames } from 'src/constants/modelNames';
import { ServiceSchema } from 'src/database/entities/service.schema';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from 'src/shared/shared.module';
import { AppointmentSchema } from 'src/database/entities/appointment.schema';
import { AppointmentService } from '../services/appointment.service';
import { AppointmentController } from '../controllers/appointment.controller';
import { ServiceModule } from 'src/services/Service/modules/service.module';
import { UserModule } from 'src/services/User/modules/user.module';
import { UserSchema } from 'src/database/entities/user.schema';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationModule } from 'src/socket/notification.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([
      { name: ModelNames.APPOINTMENT, schema: AppointmentSchema },
    ]),
    MongooseModule.forFeature([
      { name: ModelNames.SERVICE, schema: ServiceSchema },
    ]),
    MongooseModule.forFeature([{ name: ModelNames.USER, schema: UserSchema }]),
    ConfigModule,
    SharedModule,
    forwardRef(() => SalonModule),
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService],
  exports: [AppointmentService],
})
export class AppointmentModule {}
