import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';
import { AvailableConfigs } from 'src/enums/environment.enum';

@Injectable()
export class EmailService {
  constructor(private configService: ConfigService) {
    sgMail.setApiKey(
      this.configService.get<string>(AvailableConfigs.SEND_GRID_KEY),
    );
  }

  async sendEmail(email: string, message: string, flag: number) {
    const msg = {
      to: email,
      from: this.configService.get(AvailableConfigs.FROM_EMAIL),
      subject: flag === 0 ? 'Verifikacioni kod' : 'PODSETNIK',
      text: message,
    };

    try {
      await sgMail.send(msg);
      return { message: 'Mejl uspešno poslat!' };
    } catch (error) {
      throw new InternalServerErrorException('Greška pri slanju mejla');
    }
  }
}
