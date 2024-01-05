import { Module } from '@nestjs/common';
import { PaginationService } from './pagination/pagination.service';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './emails/email.service';
import { TwilioService } from './twilio/twilio.service';

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [PaginationService, EmailService, TwilioService],
  exports: [PaginationService, EmailService, TwilioService],
})
export class SharedModule {}
