import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { LocalAuthGuard } from '../guards/local-autg.guard';
import { AuthService } from '../services/auth.service';

@Controller('admins-auth')
export class AdminAuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(@Request() req) {
    const {
      user: { id, username },
    } = req;

    return this.authService.loginAdmin(id, username);
  }
}
