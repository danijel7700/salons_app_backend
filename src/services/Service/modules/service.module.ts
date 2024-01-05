import { Module, forwardRef } from '@nestjs/common';
import { ServiceService } from '../services/service.service';
import { SalonModule } from '../../Salon/modules/salon.module';
import { ServiceController } from '../controllers/service.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ModelNames } from 'src/constants/modelNames';
import { ServiceSchema } from 'src/database/entities/service.schema';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from 'src/shared/shared.module';
import { AppointmentModule } from 'src/services/Appointment/module/appointment.module';
import { NotificationModule } from 'src/socket/notification.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ModelNames.SERVICE, schema: ServiceSchema },
    ]),
    ConfigModule,
    SharedModule,
    SalonModule,
    forwardRef(() => SalonModule),
    NotificationModule,
  ],
  controllers: [ServiceController],
  providers: [ServiceService],
  exports: [ServiceService],
})
export class ServiceModule {}
