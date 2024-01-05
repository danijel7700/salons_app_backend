import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { AuthService } from '../services/auth.services';

@Controller('users-auth')
export class UserAuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(@Request() req) {
    const {
      user: { id, username },
    } = req;

    return this.authService.loginUser(id, username);
  }
}
