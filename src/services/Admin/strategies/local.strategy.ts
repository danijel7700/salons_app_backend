import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { LocalNames } from 'src/constants/authLocalNames';
import { AuthService } from '../services/auth.service';
import { Admin } from 'src/database/entities/admin.schema';

@Injectable()
export class LocalStrategy extends PassportStrategy(
  Strategy,
  LocalNames.LOCAL_ADMIN,
) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'username', passwordField: 'password' });
  }

  async validate(username: string, password: string): Promise<Admin> {
    const admin = await this.authService.validateAdmin(username, password);

    if (!admin) {
      throw new UnauthorizedException('Šifra ili korisničko ime nisu validni');
    }

    return admin;
  }
}
