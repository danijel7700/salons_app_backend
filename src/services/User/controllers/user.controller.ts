import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { JoiValidationPipe } from 'src/joi/validation.pipe';
import { createUserJoi } from 'src/joi/user.validator';
import { User } from 'src/database/entities/user.schema';
import { JwtAuthGuardUser } from '../guards/jwt-auth.guard';
import { markSalonJoi } from 'src/joi/salon.validator';
import { UserDecorator } from 'src/decorators/user.decorator';
import {
  changePasswordJoi,
  resetPassowordJoi,
  sendResetPassEmailJoi,
} from 'src/joi/change-password.validator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body(new JoiValidationPipe<User>(createUserJoi)) user) {
    return this.userService.addUser(user);
  }

  @Get()
  @UseGuards(JwtAuthGuardUser)
  async getUsers() {
    return this.userService.getUsers();
  }

  @Post('rate-salon')
  @UseGuards(JwtAuthGuardUser)
  async rateSalon(
    @Body(new JoiValidationPipe<User>(markSalonJoi)) markInfo,
    @UserDecorator('id') userId,
  ) {
    const { salonId, mark } = markInfo;
    return this.userService.rateSalon(userId, salonId, mark);
  }

  @Delete()
  @UseGuards(JwtAuthGuardUser)
  async deleteUser(@UserDecorator('id') id) {
    return this.userService.deleteUser(id);
  }

  @Patch('change-password/:newPassword')
  @UseGuards(JwtAuthGuardUser)
  async changePassword(
    @UserDecorator('id') id,
    @Param('newPassword', new JoiValidationPipe<string>(changePasswordJoi))
    newPassword,
  ) {
    return this.userService.changePassword(id, newPassword);
  }

  @Post('send-reset-email/:email')
  async sendRecoverEmail(
    @Param('email', new JoiValidationPipe<string>(sendResetPassEmailJoi)) email,
  ) {
    return this.userService.sendResetPasswordEmail(email);
  }

  @Patch('reset-password')
  async resetPassoword(
    @Body(new JoiValidationPipe<User>(resetPassowordJoi)) passwordInfo,
  ) {
    const { token, newPassword } = passwordInfo;
    return this.userService.resetPassword(token, newPassword);
  }

  @Post('subscribe/:salonId')
  @UseGuards(JwtAuthGuardUser)
  async subcribeSalon(@UserDecorator('id') id, @Param('salonId') salonId) {
    return this.userService.subscribeSalon(id, salonId);
  }

  @Post('unsubscribe/:salonId')
  @UseGuards(JwtAuthGuardUser)
  async unsubcribeSalon(@UserDecorator('id') id, @Param('salonId') salonId) {
    return this.userService.unsubscribeSalon(id, salonId);
  }

  @Get('followSalon/:salonId')
  @UseGuards(JwtAuthGuardUser)
  async followSalon(
    @Param('salonId') salonId: string,
    @UserDecorator('id') id,
  ) {
    return this.userService.userFollowSalon(id, salonId);
  }

  @Get('/me')
  @UseGuards(JwtAuthGuardUser)
  async getUser(@UserDecorator('id') id) {
    return this.userService.getUserById(id);
  }

  @Get('/salons')
  @UseGuards(JwtAuthGuardUser)
  async getSalons(@UserDecorator('id') id) {
    return this.userService.getUserSalons(id);
  }

  @Get('/salonNames/:userId')
  async findSalonNames(@Param('userId') userId) {
    return this.userService.getUserSalonsNames(userId);
  }

  @Get('/:id')
  async getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }
}
