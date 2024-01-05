import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { NotFoundError } from 'rxjs';
import { ModelNames } from 'src/constants/modelNames';
import { Appointment } from 'src/database/entities/appointment.schema';
import { Service } from 'src/database/entities/service.schema';
import { SalonService } from 'src/services/Salon/services/salon.service';
import { ServiceService } from 'src/services/Service/services/service.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TwilioService } from 'src/shared/twilio/twilio.service';
import { User } from '@sentry/node';
import { EmailService } from 'src/shared/emails/email.service';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectModel(ModelNames.APPOINTMENT)
    private appointmentModel: mongoose.Model<Appointment>,
    @InjectModel(ModelNames.SERVICE)
    private serviceModel: mongoose.Model<Service>,
    @InjectModel(ModelNames.USER)
    private userModel: mongoose.Model<User>,
    @Inject(forwardRef(() => SalonService))
    private readonly salonService: SalonService,
    private readonly twilioService: TwilioService,
    private readonly emailService: EmailService,
  ) {}

  async getAppointmentForHairstylist(
    hairStylistId: string,
    date: string,
  ): Promise<Appointment[]> {
    if (!mongoose.isValidObjectId(hairStylistId)) {
      throw new BadRequestException('Nevalidan Id');
    }
    return this.appointmentModel.find({
      hairStylistId: new mongoose.Types.ObjectId(hairStylistId),
      date,
    });
  }

  async addAppointment(appointment: Appointment, userId: string) {
    const hairStylist = await this.salonService.findHairStylist(
      appointment.hairStylistId.toString(),
    );

    const service = await this.serviceModel.findById(appointment.serviceId);

    if (!service) {
      throw new NotFoundException('Ne postoji usluga za zadati ID');
    }

    const apps = await this.getAppointmentForHairstylist(
      appointment.hairStylistId.toString(),
      appointment.date,
    );

    const newAppTerms = await this.getIntervals(
      appointment.time,
      service.terms,
    );

    let flag = 0;

    for (const app of apps) {
      const currentAppTerms = await this.getIntervals(
        app.time,
        app.numberOfTerms,
      );

      if (newAppTerms.some((element) => currentAppTerms.includes(element))) {
        throw new BadRequestException('Termin je zauzet');
      }
    }

    const newApp = new this.appointmentModel({
      ...appointment,
      numberOfTerms: service.terms,
      salonId: hairStylist.salonId,
      userId: new mongoose.Types.ObjectId(userId),
    });

    await this.appointmentModel.create(newApp);

    return 'Uspešno ste zakazali termin';
  }

  async getIntervals(time: string, numberOfTerms: number) {
    const intervals = [];
    const start = new Date(`2000-01-01 ${time}`);

    for (let i = 0; i < numberOfTerms; i++) {
      intervals.push(
        start.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }),
      );
      start.setMinutes(start.getMinutes() + 30);
    }
    return intervals;
  }

  async deleteAppointmetsForHairstylist(id: string) {
    await this.appointmentModel.deleteMany({ hairStylistId: id });
  }

  async getAppointmentForUser(userId: string) {
    const apps = await this.appointmentModel.find({
      userId: new mongoose.Types.ObjectId(userId),
    });

    const salons = await Promise.all(
      apps.map((app) => {
        return this.salonService.findSalon(app.salonId.toString());
      }),
    );

    const services = await Promise.all(
      apps.map((app) => {
        return this.serviceModel.findById(app.serviceId);
      }),
    );

    const result = await Promise.all(
      apps.map((app, index) => {
        return {
          time: app.time,
          date: app.date,
          salonName: salons[index].name,
          serviceName: services[index].name,
        };
      }),
    );

    return result;
  }

  @Cron(CronExpression.EVERY_DAY_AT_NOON)
  async sendReminder() {
    const apps = await this.appointmentModel.find();
    await Promise.all(
      apps.map(async (app) => {
        const appDate = new Date(
          parseInt(app.date.split('/')[2]),
          parseInt(app.date.split('/')[1]) - 1,
          parseInt(app.date.split('/')[0]),
        );

        if (+appDate - +new Date() <= 24 * 60 * 60 * 1000) {
          const salon = await this.salonService.findSalon(
            app.salonId.toString(),
          );
          const message = `Sutra u ${app.time} imate zakazan termin u salonu ${salon.name}, na adresi ${salon.location.street} ${salon.location.number}.`;
          this.twilioService.sendSms('+381658058874', message);
          this.emailService.sendEmail('cakicdanijel7700@gmail.com', message, 1);
        }
      }),
    );
  }
}
