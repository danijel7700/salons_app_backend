import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { format } from 'date-fns';
import mongoose from 'mongoose';
import { ModelNames } from 'src/constants/modelNames';
import { Notification } from 'src/database/entities/notification.schema';
import { Service } from 'src/database/entities/service.schema';
import { SalonService } from 'src/services/Salon/services/salon.service';
import { NotificationService } from 'src/socket/notification.service';

@Injectable()
export class ServiceService {
  constructor(
    @InjectModel(ModelNames.SERVICE)
    private serviceModel: mongoose.Model<Service>,
    private readonly salonService: SalonService,
    private readonly notificationService: NotificationService,
  ) {}

  async createService(salonId: string, service: Service): Promise<Service> {
    const newService = {
      ...service,
      salonId: new mongoose.Types.ObjectId(salonId),
    };

    return this.serviceModel.create(newService);
  }

  async changeService(
    salonId: string,
    serviceId: string,
    info: { cost: number; terms: number },
  ): Promise<Service> {
    if (!mongoose.isValidObjectId(serviceId)) {
      throw new BadRequestException('Nevalidan ID za uslugu!');
    }

    const service = await this.serviceModel.findById(serviceId);

    if (!service) {
      throw new NotFoundException('Ne postoji usluga za zadati ID!');
    }

    if (!service.salonId.equals(new mongoose.Types.ObjectId(salonId))) {
      throw new ForbiddenException(
        'Salon moze modifikovati samo svoje usluge!',
      );
    }

    const salon = await this.salonService.findSalon(salonId);

    service.cost = info.cost ? info.cost : service.cost;
    service.terms = info.terms ? info.terms : service.terms;

    const notification: Notification = {
      content: `IZMENA CENE USLUGE: Usluga ${service.name} u salonu ${salon.name} ima novu cenu. Nova cena je ${info.cost} din.`,
      time: format(new Date(), 'dd/MM/yyyy'),
      salonName: salon.name,
    };

    await this.notificationService.createNotification(notification, salon.name);

    return service.save();
  }

  async deleteService(salonId: string, serviceId: string) {
    if (!mongoose.isValidObjectId(serviceId)) {
      throw new BadRequestException('Nevalidan ID za uslugu!');
    }

    const service = await this.serviceModel.findById(serviceId);

    if (!service) {
      throw new NotFoundException('Ne postoji usluga za zadati ID!');
    }

    if (!service.salonId.equals(new mongoose.Types.ObjectId(salonId))) {
      throw new ForbiddenException(
        'Salon moze modifikovati samo svoje usluge!',
      );
    }

    await this.serviceModel.findByIdAndDelete(serviceId);

    return 'Usluga uspesno izbrisana!';
  }

  async getSalonServices(salonId: string): Promise<Service[]> {
    if (!mongoose.isValidObjectId(salonId)) {
      throw new BadRequestException('Nevalidan ID!');
    }

    if (!(await this.salonService.findSalonById(salonId))) {
      throw new BadRequestException('Ne postoji salon za zadati ID!');
    }

    return this.serviceModel.find({
      salonId: new mongoose.Types.ObjectId(salonId),
    });
  }

  async getService(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Nevalidan Id');
    }
    return this.serviceModel.findById(id);
  }
}
