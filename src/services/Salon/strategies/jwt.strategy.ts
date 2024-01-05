import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AvailableConfigs } from 'src/enums/environment.enum';
import { GuardsNames } from 'src/constants/authGuardNames';
import { SalonService } from '../services/salon.service';

@Injectable()
export class JwtStrategySalon extends PassportStrategy(
  Strategy,
  GuardsNames.JWR_SALON,
) {
  constructor(
    private salonService: SalonService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(AvailableConfigs.JWT_SECRET),
    });
  }

  async validate(payload: any) {
    return this.salonService.findSalonById(payload.id);
  }
}