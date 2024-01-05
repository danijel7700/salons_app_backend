import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { ModelNames } from 'src/constants/modelNames';
import { Salon } from 'src/database/entities/salon.schema';
import * as bcrypt from 'bcrypt';
import { PaginationResponseType } from 'src/types/paginationResponseTypes.definition';
import { PaginationService } from 'src/shared/pagination/pagination.service';
import { EmailService } from 'src/shared/emails/email.service';
import * as crypto from 'crypto';
import { PaginationOptions } from 'src/types/paginationOptions.definition';
import { Post } from 'src/database/entities/post.schema';
import { format } from 'date-fns';
import { AppointmentService } from 'src/services/Appointment/services/appointment.service';
import { HairStylist } from 'src/database/entities/hairstylist.schema';
import { Service } from 'src/database/entities/service.schema';
import { NotificationService } from 'src/socket/notification.service';
import { Notification } from 'src/database/entities/notification.schema';

@Injectable()
export class SalonService {
  constructor(
    @InjectModel(ModelNames.SALON)
    private salonModel: mongoose.Model<Salon>,
    @InjectModel(ModelNames.POST)
    private postModel: mongoose.Model<Post>,
    @InjectModel(ModelNames.HAIRSTYLIST)
    private hairStylistModel: mongoose.Model<HairStylist>,
    @InjectModel(ModelNames.SERVICE)
    private serviceModel: mongoose.Model<Service>,
    private readonly configService: ConfigService,
    private readonly paginationService: PaginationService<Salon>,
    private readonly emailService: EmailService,
    @Inject(forwardRef(() => AppointmentService))
    private readonly appointmentService: AppointmentService,
    private readonly notificationService: NotificationService,
  ) {}

  async findSalonById(id: string): Promise<Salon> {
    return await this.salonModel.findById(id);
  }

  async getSalons(
    paginationOptions: PaginationOptions,
    reg: string,
  ): Promise<PaginationResponseType<Salon>> {
    const query = reg ? { name: { $regex: reg, $options: 'i' } } : {};

    return this.paginationService.getPaginated(
      this.salonModel,
      query,
      paginationOptions,
    );
  }

  async addSalon(salon: Salon): Promise<Salon> {
    const hashedPass = await bcrypt.hash(salon.password, 10);

    const newUser = new this.salonModel({
      ...salon,
      type:
        salon.type === 'm' || salon.type === 'M'
          ? 'Muški'
          : salon.type === 'z' || salon.type === 'Z'
          ? 'Ženski'
          : 'Muško-Ženski',
      password: hashedPass,
      markInfo: {
        mark: 0,
        numberOfMarks: 0,
      },
      isVerified: true,
    });

    return this.salonModel.create(newUser);
  }

  async rateSalon(salonId: string, newMark: number) {
    const salon = await this.salonModel.findById(salonId);

    if (!salon) {
      throw new NotFoundException('Ne postoji salon za zadati ID!');
    }

    const { mark, numberOfMarks } = salon.markInfo;

    salon.markInfo.mark =
      (mark * numberOfMarks + newMark) / (numberOfMarks + 1);
    salon.markInfo.numberOfMarks = numberOfMarks + 1;

    salon.save();

    return;
  }

  async findSalon(id: string): Promise<Salon> {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Nevalidan ID!');
    }

    return await this.salonModel
      .findById(id)
      .populate('services')
      .populate('posts')
      .populate('hairStylists')
      .populate('appointments');
  }

  async findHairStylist(id: string): Promise<HairStylist> {
    const hairstylist = await this.hairStylistModel.findById(id);

    if (!hairstylist) {
      throw new NotFoundException('Ne postoji frizer za zadati Id');
    }

    return hairstylist;
  }

  async changePassword(id: string, newPass: string): Promise<Salon> {
    const salon = await this.salonModel.findById(id);

    if (!salon) {
      throw new NotFoundException('Ne postoji salon za zadati id!');
    }

    const hashedPass = await bcrypt.hash(newPass, 10);

    salon.password = hashedPass;

    await salon.save();

    return salon;
  }

  async sendResetPasswordEmail(email: string) {
    const salon = await this.salonModel.findOne({ email });

    if (!salon) {
      return new NotFoundException('Ne postoji salon za zadatu email adresu!');
    }

    const buffer = crypto.randomBytes(32).toString('hex');

    salon.resetToken = buffer;
    await salon.save();

    const resetMessage = `Vaš verifikacioni kod za obnovu šifre je ${buffer}`;

    return this.emailService.sendEmail(email, resetMessage, 0);
  }

  async resetPassword(token: string, newPass: string): Promise<Salon> {
    const salon = await this.salonModel.findOne({ resetToken: token });
    if (!salon) {
      throw new NotFoundException('Salon nije pronadjen');
    }

    const hashedPass = await bcrypt.hash(newPass, 10);

    salon.password = hashedPass;
    salon.resetToken = null;

    await salon.save();

    return salon;
  }

  async addPictures(originalnames: string[], salonId: string) {
    await Promise.all(
      originalnames.map(async (originalName) => {
        return this.postModel.create({
          image: originalName,
          time: format(new Date(), 'dd/MM/yyyy'),
          salonId: new mongoose.Types.ObjectId(salonId),
        });
      }),
    );

    //return this.salonModel.findById(salonId).populate('posts');
    return 'Uspešno ste dodali sliku';
  }

  async addHairstylist(hairstylist: HairStylist, salonId: string) {
    const newHairStylist = new this.hairStylistModel({
      ...hairstylist,
      salonId: new mongoose.Types.ObjectId(salonId),
    });

    return this.hairStylistModel.create(newHairStylist);
  }

  async getFreeTerms(
    hairStylistId: string,
    dateString: string,
    serviceId: string,
  ) {
    const dayNum = await this.getDay(dateString);

    if (!mongoose.isValidObjectId(hairStylistId)) {
      throw new BadRequestException('Nevalidan ID');
    }

    const hairStylist = await this.hairStylistModel.findById(hairStylistId);

    const salon = await this.salonModel.findById(hairStylist.salonId);

    const workTime = salon.workTime[dayNum];

    if (workTime === 'Ne radi') {
      throw new NotFoundException('Salon ne radi tog dana');
    }

    const [startTime, endTime] = workTime.split(' - ');

    const intervals = await this.getIntervals(startTime, endTime);

    const apps = await this.appointmentService.getAppointmentForHairstylist(
      hairStylistId,
      dateString,
    );

    const appsTerms = await Promise.all(
      apps.map(async (app) => {
        return this.appointmentService.getIntervals(
          app.time,
          app.numberOfTerms,
        );
      }),
    );

    const appsTermsConcat = appsTerms.reduce(
      (accumulator, currentArray) => accumulator.concat(currentArray),
      [],
    );

    const service = await this.serviceModel.findById(serviceId);

    const freeTermins = intervals.filter(
      (interval) => !appsTermsConcat.includes(interval),
    );

    const validTerms = [];
    let flag = 0;

    for (let i = 0; i < freeTermins.length - service.terms; i++) {
      flag = 0;
      const start = new Date(`2000-01-01T${freeTermins[i]}:00Z`);
      for (let j = i + 1; j < i + service.terms; j++) {
        const end = new Date(`2000-01-01 ${freeTermins[j]}:00Z`);
        if (+end - +start > 1800000) {
          flag = 1;
          break;
        }
        start.setMinutes(start.getMinutes() + 30);
      }
      if (flag === 0) {
        validTerms.push(freeTermins[i]);
      }
    }

    return validTerms;
  }

  private async getDay(dateString: string) {
    const days = [6, 0, 1, 2, 3, 4, 5]; // ned, pon, ut, sr, cet, pet, sub, ned
    const parts = dateString.split('/');
    const year = parseInt(parts[2], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[0], 10);

    const date = new Date(year, month, day);
    return days[date.getDay()];
  }

  private async getIntervals(startTime: string, endTime: string) {
    const intervals = [];
    const start = new Date(`2000-01-01 ${startTime}`);
    const end = new Date(`2000-01-01 ${endTime}`);

    while (start < end) {
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

  async deleteHairStylist(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Nevalidan Id');
    }

    await this.hairStylistModel.findByIdAndDelete(id);

    await this.appointmentService.deleteAppointmetsForHairstylist(id);

    return 'Upešno ste obrisali';
  }

  async changeWorkTime(salonId: string, workTime: string[]) {
    const salon = await this.salonModel.findByIdAndUpdate(salonId, {
      workTime,
    });

    const notification: Notification = {
      content: `IZMENA RADNOG VREMENA: Salon ${salon.name} je izmenio svoje radno vreme.`,
      time: format(new Date(), 'dd/MM/yyyy'),
      salonName: salon.name,
    };

    await this.notificationService.createNotification(notification, salon.name);

    return 'Uspešno ste promenili radno vreme';
  } // NOTIFIKACIJA
}
