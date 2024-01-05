import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { SalonService } from '../services/salon.service';
import { JoiValidationPipe } from 'src/joi/validation.pipe';
import { Salon } from 'src/database/entities/salon.schema';
import {
  changeWorkTime,
  createSalonJoi,
  getTermsJoi,
} from 'src/joi/salon.validator';
import { JwtAuthGuardSalon } from '../guards/jwt-auth.guard';
import { SalonDecorator } from 'src/decorators/salon.decorator';
import {
  changePasswordJoi,
  resetPassowordJoi,
  sendResetPassEmailJoi,
} from 'src/joi/change-password.validator';
import { PaginationOptions } from 'src/types/paginationOptions.definition';
import { ParseQueryPipe } from 'src/shared/pagination/parse-query.pipe';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuardUser } from 'src/services/User/guards/jwt-auth.guard';
import { HairStylist } from 'src/database/entities/hairstylist.schema';
import { createHairStylistJoi } from 'src/joi/hairStylist.validator';
import { UserDecorator } from 'src/decorators/user.decorator';

@Controller('salons')
export class SalonController {
  constructor(private readonly salonService: SalonService) {}

  @Post()
  async createSalon(@Body(new JoiValidationPipe<Salon>(createSalonJoi)) salon) {
    return this.salonService.addSalon(salon);
  }

  @Patch('change-password/:newPassword')
  @UseGuards(JwtAuthGuardSalon)
  async changePassword(
    @SalonDecorator('id') id,
    @Param('newPassword', new JoiValidationPipe<string>(changePasswordJoi))
    newPassword,
  ) {
    return this.salonService.changePassword(id, newPassword);
  }

  @Post('send-reset-email/:email')
  async sendRecoverEmail(
    @Param('email', new JoiValidationPipe<string>(sendResetPassEmailJoi)) email,
  ) {
    return this.salonService.sendResetPasswordEmail(email);
  }

  @Patch('reset-password')
  async resetPassoword(
    @Body(new JoiValidationPipe<Salon>(resetPassowordJoi)) passwordInfo,
  ) {
    const { token, newPassword } = passwordInfo;
    return this.salonService.resetPassword(token, newPassword);
  }

  @Get()
  async getSalons(
    @Query(new ParseQueryPipe()) paginationOptions: PaginationOptions,
    @Query('reg') reg: string,
  ) {
    return this.salonService.getSalons(paginationOptions, reg);
  }

  @Post('add-images')
  @UseGuards(JwtAuthGuardSalon)
  @UseInterceptors(FilesInterceptor('files', 10))
  async addPictures(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image' })],
      }),
    )
    files: Express.Multer.File[],
    @SalonDecorator('id') id,
  ) {
    const mappedFiles = files.map((file) => file.originalname);
    return this.salonService.addPictures(mappedFiles, id);
  }

  @Post('add-hairstylist')
  @UseGuards(JwtAuthGuardSalon)
  async addHairStylist(
    @Body(new JoiValidationPipe<HairStylist>(createHairStylistJoi)) hairStylist,
    @SalonDecorator('id') id,
  ) {
    return this.salonService.addHairstylist(hairStylist, id);
  }

  @Post('/terms')
  @UseGuards(JwtAuthGuardUser)
  async getTerms(
    @Body(new JoiValidationPipe<any>(getTermsJoi))
    termsInfo,
  ) {
    const { hairStylistId, date, serviceId } = termsInfo;
    return await this.salonService.getFreeTerms(hairStylistId, date, serviceId);
  }

  @Get('/:salonId')
  async getSalon(@Param('salonId') salonId: string) {
    return this.salonService.findSalon(salonId);
  }

  @Delete('delete/:hairStylistId')
  @UseGuards(JwtAuthGuardSalon)
  async deleteHairStylist(@Param('hairStylistId') hairStylistId: string) {
    return this.salonService.deleteHairStylist(hairStylistId);
  }

  @Patch('change-workTime')
  @UseGuards(JwtAuthGuardSalon)
  async changeWorkTime(
    @Body(new JoiValidationPipe<any>(changeWorkTime)) workTimeObj,
    @SalonDecorator('id') id: string,
  ) {
    const { workTime } = workTimeObj;
    return this.salonService.changeWorkTime(id, workTime);
  }
}
