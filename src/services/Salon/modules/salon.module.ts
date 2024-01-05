import { Module, forwardRef } from '@nestjs/common';
import { SalonController } from '../controllers/salon.controller';
import { SalonService } from '../services/salon.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { ModelNames } from 'src/constants/modelNames';
import { SalonSchema } from 'src/database/entities/salon.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AvailableConfigs } from 'src/enums/environment.enum';
import { JwtModule } from '@nestjs/jwt';
import { SalonAuthController } from '../controllers/salon_auth.controller';
import { AuthService } from '../services/auth.service';
import { LocalStrategy } from '../strategies/local.strategy';
import { JwtStrategySalon } from '../strategies/jwt.strategy';
import { SharedModule } from 'src/shared/shared.module';
import { PostSchema } from 'src/database/entities/post.schema';
import { AppointmentSchema } from 'src/database/entities/appointment.schema';
import { AppointmentModule } from 'src/services/Appointment/module/appointment.module';
import { HairStylistSchema } from 'src/database/entities/hairstylist.schema';
import { ServiceSchema } from 'src/database/entities/service.schema';
import { NotificationModule } from 'src/socket/notification.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ModelNames.SALON, schema: SalonSchema },
    ]),
    MongooseModule.forFeature([{ name: ModelNames.POST, schema: PostSchema }]),
    MongooseModule.forFeature([
      { name: ModelNames.HAIRSTYLIST, schema: HairStylistSchema },
    ]),
    MongooseModule.forFeature([
      { name: ModelNames.SERVICE, schema: ServiceSchema },
    ]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>(AvailableConfigs.JWT_SECRET),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
    SharedModule,
    forwardRef(() => AppointmentModule),
    NotificationModule,
  ],
  controllers: [SalonController, SalonAuthController],
  providers: [SalonService, AuthService, LocalStrategy, JwtStrategySalon],
  exports: [SalonService],
})
export class SalonModule {}
