import { Controller, Post, UseGuards, Request } from "@nestjs/common";
import { LocalAuthGuard } from "../guards/local-auth.guard";
import { AuthService } from "../services/auth.service";

@Controller('salons-auth')
export class SalonAuthController{
    constructor(private readonly authService: AuthService){}

    @Post('login')
    @UseGuards(LocalAuthGuard)
    login(@Request() req) {
      
      const {
        user: { id, email },
      } = req;
  
      return this.authService.loginSalon(id, email);
    }
}