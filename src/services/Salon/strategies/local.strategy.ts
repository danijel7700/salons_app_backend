import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { LocalNames } from 'src/constants/authLocalNames';
import { Salon } from 'src/database/entities/salon.schema';
import { AuthService } from '../services/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, LocalNames.LOCAL_SALON) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email', passwordField: 'password' });
  }

  async validate(email: string, password: string): Promise<Salon> {
    const salon = await this.authService.validateSalon(email, password);

    if (!salon) {
      throw new UnauthorizedException('Šifra ili email nisu validni');
    }

    return salon;
  }
}