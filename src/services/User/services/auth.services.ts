import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/database/entities/user.schema';
import { ModelNames } from 'src/constants/modelNames';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(ModelNames.USER)
    private userModel: mongoose.Model<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userModel.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }

    return null;
  }

  async loginUser(id: string, username: string) {
    const payload = {
      id,
      username,
    };

    const user = await this.userModel.findById(id);

    const accessToken = this.jwtService.sign(payload);

    return {
      access_token: accessToken,
      user,
    };
  }
}
