import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { ConfigService } from '@nestjs/config';
import { NotificationModule } from './notification.module';
import { NotificationService } from './notification.service';

@Module({
  imports: [],
  controllers: [],
  providers: [SocketGateway, ConfigService],
  exports: [SocketGateway],
})
export class GatewayModule {}
