import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ModelNames } from 'src/constants/modelNames';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Admin } from 'src/database/entities/admin.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(ModelNames.ADMIN)
    private adminModel: mongoose.Model<Admin>,
    private jwtService: JwtService,
  ) {}

  async validateAdmin(username: string, password: string): Promise<Admin> {
    const admin = await this.adminModel.findOne({ username });

    if (admin && (await bcrypt.compare(password, admin.password))) {
      return admin;
    }

    return null;
  }

  async loginAdmin(id: string, username: string) {
    const payload = {
      id,
      username,
    };

    const admin = await this.adminModel.findById(id);

    const accessToken = this.jwtService.sign(payload);

    return {
      access_token: accessToken,
      admin,
    };
  }
}
