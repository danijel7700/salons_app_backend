import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../services/auth.services';
import { User } from 'src/database/entities/user.schema';
import { LocalNames } from 'src/constants/authLocalNames';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, LocalNames.LOCAL_USER) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'username', passwordField: 'password' });
  }

  async validate(username: string, password: string): Promise<User> {
    const user = await this.authService.validateUser(username, password);

    if (!user) {
      throw new UnauthorizedException('Šifra ili korisničko ime nisu validni');
    }

    return user;
  }
}