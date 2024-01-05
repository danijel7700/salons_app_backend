import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { ModelNames } from 'src/constants/modelNames';
import { Admin } from 'src/database/entities/admin.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(ModelNames.ADMIN)
    private adminModel: mongoose.Model<Admin>,
    private readonly configService: ConfigService,
  ) {}

  async getAdmins() {
    return this.adminModel.find();
  }

  async createAdmin(admin: Admin) {
    const hashedPass = await bcrypt.hash(admin.password, 10);

    const newAdmin = new this.adminModel({
      ...admin,
      password: hashedPass,
    });

    return this.adminModel.create(newAdmin);
  }

  async findAdminById(id: string): Promise<Admin> {
    return this.adminModel.findById(id);
  }
}
