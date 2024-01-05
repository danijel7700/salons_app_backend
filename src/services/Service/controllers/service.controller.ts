import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuardSalon } from '../../Salon/guards/jwt-auth.guard';
import { SalonDecorator } from 'src/decorators/salon.decorator';
import { JoiValidationPipe } from 'src/joi/validation.pipe';
import { Service } from 'src/database/entities/service.schema';
import { ServiceService } from '../services/service.service';
import { changeServiceJoi, createServiceJoi } from 'src/joi/service.validator';

@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  @UseGuards(JwtAuthGuardSalon)
  async addService(
    @SalonDecorator('id') salonId,
    @Body(new JoiValidationPipe<Service>(createServiceJoi)) service,
  ) {
    return this.serviceService.createService(salonId, service);
  }

  @Patch()
  @UseGuards(JwtAuthGuardSalon)
  async changeService(
    @SalonDecorator('id') salonId,
    @Body(new JoiValidationPipe<Service>(changeServiceJoi)) serviceInfo,
  ) {
    const { id, cost, terms } = serviceInfo;
    return this.serviceService.changeService(salonId, id, { cost, terms });
  }

  @Delete(':serviceId')
  @UseGuards(JwtAuthGuardSalon)
  async deleteService(
    @SalonDecorator('id') salonId,
    @Param('serviceId') serviceId: string,
  ) {
    return this.serviceService.deleteService(salonId, serviceId);
  }

  @Get('/service/:id')
  async getService(@Param('id') id: string) {
    return this.serviceService.getService(id);
  }

  @Get(':salonId')
  async getSalonServices(@Param('salonId') salonId: string) {
    return this.serviceService.getSalonServices(salonId);
  }
}
