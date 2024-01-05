import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AvailableConfigs } from 'src/enums/environment.enum';
import { GuardsNames } from 'src/constants/authGuardNames';
import { UserService } from '../services/user.service';

@Injectable()
export class JwtStrategyUser extends PassportStrategy(
  Strategy,
  GuardsNames.JWT_USER,
) {
  constructor(
    private userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(AvailableConfigs.JWT_SECRET),
    });
  }

  async validate(payload: any) {
    return this.userService.findUserById(payload.id);
  }
}