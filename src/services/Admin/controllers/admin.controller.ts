import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AdminService } from '../services/admin.service';
import { JwtAuthGuardAdmin } from '../guards/jwt-auth.guard';
import { JoiValidationPipe } from 'src/joi/validation.pipe';
import { Admin } from 'src/database/entities/admin.schema';
import { createAdminJoi } from 'src/joi/admin.validator';
import { ApiKeyGuard } from '../guards/api-key.guard';

@Controller('admins')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  @UseGuards(JwtAuthGuardAdmin)
  async getAdmins() {
    return this.adminService.getAdmins();
  }

  @Post()
  @UseGuards(JwtAuthGuardAdmin)
  async createAdmin(@Body(new JoiValidationPipe<Admin>(createAdminJoi)) admin) {
    return this.adminService.createAdmin(admin);
  }

  @Post('init')
  @UseGuards(ApiKeyGuard)
  async createInitAdmin(
    @Body(new JoiValidationPipe<Admin>(createAdminJoi))
    admin,
  ): Promise<Admin> {
    return this.adminService.createAdmin(admin);
  }
}
