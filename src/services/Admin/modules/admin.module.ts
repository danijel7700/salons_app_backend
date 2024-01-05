import { Module } from '@nestjs/common';
import { AdminController } from '../controllers/admin.controller';
import { AdminService } from '../services/admin.service';
import { ModelNames } from 'src/constants/modelNames';
import { AdminSchema } from 'src/database/entities/admin.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AvailableConfigs } from 'src/enums/environment.enum';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '../services/auth.service';
import { AdminAuthController } from '../controllers/admin_auth.controller';
import { LocalStrategy } from '../strategies/local.strategy';
import { JwtStrategyAdmin } from '../strategies/jwt.strategy';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ModelNames.ADMIN, schema: AdminSchema },
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
  ],
  controllers: [AdminController, AdminAuthController],
  providers: [AdminService, AuthService, JwtStrategyAdmin, LocalStrategy],
  exports: [],
})
export class AdminModule {}
