import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/database/entities/user.schema';
import { ModelNames } from 'src/constants/modelNames';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Salon } from 'src/database/entities/salon.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(ModelNames.SALON)
    private salonModel: mongoose.Model<Salon>,
    private jwtService: JwtService,
  ) {}

  async validateSalon(email: string, password: string): Promise<Salon> {
    const salon = await this.salonModel.findOne({ email });

    if (salon && (await bcrypt.compare(password, salon.password))) {
      return salon;
    }

    return null;
  }

  async loginSalon(id: string, email: string) {
    const payload = {
      id,
      email,
    };

    const salon = await this.salonModel.findById(id);

    const accessToken = this.jwtService.sign(payload);

    return {
      access_token: accessToken,
      salon,
    };
  }
}
