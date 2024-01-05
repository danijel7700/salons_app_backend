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
import { AppointmentService } from '../services/appointment.service';
import { JwtAuthGuardSalon } from 'src/services/Salon/guards/jwt-auth.guard';
import { JwtAuthGuardUser } from 'src/services/User/guards/jwt-auth.guard';
import { JoiValidationPipe } from 'src/joi/validation.pipe';
import { Appointment } from 'src/database/entities/appointment.schema';
import { createAppointmentJoi } from 'src/joi/appointment.validator';
import { UserDecorator } from 'src/decorators/user.decorator';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @UseGuards(JwtAuthGuardUser)
  async addAppointment(
    @Body(new JoiValidationPipe<Appointment>(createAppointmentJoi)) appointment,
    @UserDecorator('id') id,
  ) {
    return this.appointmentService.addAppointment(appointment, id);
  }

  @Get()
  @UseGuards(JwtAuthGuardSalon)
  async getAppointmentsForHairstylist(
    @Query('hairstylistId') hairstylistId: string,
    @Query('date') date: string,
  ) {
    console.log(hairstylistId);
    return this.appointmentService.getAppointmentForHairstylist(
      hairstylistId,
      date,
    );
  }

  @Get('myApp')
  @UseGuards(JwtAuthGuardUser)
  async getAppointmentsForUser(@UserDecorator('id') id) {
    return this.appointmentService.getAppointmentForUser(id);
  }
}
