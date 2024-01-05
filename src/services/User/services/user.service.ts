import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { ModelNames } from 'src/constants/modelNames';
import { User } from 'src/database/entities/user.schema';
import * as bcrypt from 'bcrypt';
import { SalonService } from 'src/services/Salon/services/salon.service';
import * as crypto from 'crypto';
import { EmailService } from 'src/shared/emails/email.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(ModelNames.USER)
    private userModel: mongoose.Model<User>,
    private readonly configService: ConfigService,
    private readonly salonService: SalonService,
    private readonly emailService: EmailService,
  ) {}

  async addUser(user: User): Promise<User> {
    const hashedPass = await bcrypt.hash(user.password, 10);

    const newUser = new this.userModel({
      ...user,
      password: hashedPass,
      ratedSalons: [],
      followedSalons: [],
    });

    return this.userModel.create(newUser);
  }

  async getUsers(): Promise<User[]> {
    return this.userModel.find();
  }

  async findUserById(id: string): Promise<User> {
    return this.userModel.findById(id);
  }

  async rateSalon(userId: string, salonId: string, mark: number) {
    const user = await this.userModel.findById(userId);

    if (user.ratedSalons.includes(new mongoose.Types.ObjectId(salonId))) {
      throw new BadRequestException('Korisnik je vec ocenio salon!');
    }

    await this.salonService.rateSalon(salonId, mark);

    user.ratedSalons.push(new mongoose.Types.ObjectId(salonId));
    await user.save();

    return 'Salon je uspešno ocenjen!';
  }

  async deleteUser(id: string) {
    await this.userModel.findByIdAndDelete(id);

    return 'Korisnik je uspesno obrisan';
  }

  async changePassword(id: string, newPass: string): Promise<User> {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException();
    }

    const hashedPass = await bcrypt.hash(newPass, 10);

    user.password = hashedPass;

    await user.save();

    return user;
  }

  async sendResetPasswordEmail(email: string) {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      return new NotFoundException(
        'Ne postoji korisnik za zadatu email adresu!',
      );
    }

    const buffer = crypto.randomBytes(32).toString('hex');

    user.resetToken = buffer;
    await user.save();

    const resetMessage = `Vaš verifikacioni kod za obnovu šifre je ${buffer}`;

    return this.emailService.sendEmail(email, resetMessage, 0);
  }

  async resetPassword(token: string, newPass: string): Promise<User> {
    const user = await this.userModel.findOne({ resetToken: token });
    if (!user) {
      throw new NotFoundException('Korisnik nije pronadjen');
    }

    const hashedPass = await bcrypt.hash(newPass, 10);

    user.password = hashedPass;
    user.resetToken = null;

    await user.save();

    return user;
  }

  async subscribeSalon(userId: string, salonId: string) {
    const user = await this.userModel.findById(userId);

    const salon = await this.salonService.findSalonById(salonId);
    if (!salon) {
      throw new NotFoundException('Ne postoji salon za zadati ID!');
    }

    if (user.followedSalons.includes(new mongoose.Types.ObjectId(salon.id))) {
      throw new BadRequestException('Korinsik već prati salon!');
    }

    user.followedSalons.push(new mongoose.Types.ObjectId(salon.id));

    await user.save();

    return 'Uspešno ste se pretplatili na salon!';
  }

  async unsubscribeSalon(userId: string, salonId: string) {
    const user = await this.userModel.findById(userId);

    const salon = await this.salonService.findSalonById(salonId);
    if (!salon) {
      throw new NotFoundException('Ne postoji salon za zadati ID!');
    }

    if (!user.followedSalons.includes(new mongoose.Types.ObjectId(salon.id))) {
      throw new BadRequestException('Korinsik ne prati salon!');
    }

    const filterSalons = user.followedSalons.filter(
      (id) => id.toString() !== salon.id,
    );

    await this.userModel.findByIdAndUpdate(userId, {
      followedSalons: filterSalons,
    });

    return 'Uspešno ste otpratili salon!';
  }

  async userFollowSalon(userId: string, salonId: string) {
    const user = await this.userModel.findById(userId);

    if (!mongoose.isValidObjectId(salonId)) {
      throw new BadRequestException('Nevalidan ID');
    }

    return user.followedSalons.includes(new mongoose.Types.ObjectId(salonId));
  }

  async getUserById(id: string): Promise<User> {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Nevalidan Id!');
    }

    return this.userModel.findById(id);
  }

  async getUserSalons(id: string) {
    const user = await this.userModel.findById(id);

    const result = await Promise.all(
      user.followedSalons.map((salonId) => {
        return this.salonService.findSalon(salonId.toString());
      }),
    );

    return result;
  }

  async getUserSalonsNames(id: string) {
    const user = await this.userModel.findById(id);

    const result = await Promise.all(
      user.followedSalons.map(async (salonId) => {
        const salon = await this.salonService.findSalon(salonId.toString());
        return salon.name;
      }),
    );

    return result;
  }
}
