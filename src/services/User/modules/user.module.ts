import { Module, forwardRef } from '@nestjs/common';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ModelNames } from 'src/constants/modelNames';
import { UserSchema } from 'src/database/entities/user.schema';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AvailableConfigs } from 'src/enums/environment.enum';
import { JwtModule } from '@nestjs/jwt';
import { UserAuthController } from '../controllers/user_auth.controller';
import { AuthService } from '../services/auth.services';
import { JwtStrategyUser } from '../strategies/jwt.strategy';
import { LocalStrategy } from '../strategies/local.strategy';
import { SharedModule } from 'src/shared/shared.module';
import { SalonModule } from 'src/services/Salon/modules/salon.module';
import { NotificationModule } from 'src/socket/notification.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ModelNames.USER, schema: UserSchema }]),
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
    SalonModule,
    forwardRef(() => NotificationModule),
  ],
  controllers: [UserController, UserAuthController],
  providers: [UserService, AuthService, LocalStrategy, JwtStrategyUser],
  exports: [UserService],
})
export class UserModule {}
