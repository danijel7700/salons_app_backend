import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';
import { AvailableConfigs } from '../../enums/environment.enum';

@Injectable()
export class TwilioService {
  private readonly client: Twilio;

  constructor(private configService: ConfigService) {
    this.client = new Twilio(
      this.configService.get(AvailableConfigs.TWILIO_ACC_SID),
      this.configService.get(AvailableConfigs.TWILIO_AUTH_TOKEN),
    );
  }

  async sendSms(phoneNumber: string, message: string) {
    await this.client.messages.create({
      from: this.configService.get(AvailableConfigs.TWILIO_PHONE_NUMBER),
      to: phoneNumber,
      body: message,
    });
  }
}
