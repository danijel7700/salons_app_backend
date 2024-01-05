import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NotificationService } from './notification.service';
import { Notification } from 'src/database/entities/notification.schema';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:4000'],
  },
})
export class SocketGateway {
  @WebSocketServer()
  private server: Server;

  constructor(private readonly configService: ConfigService) {}

  @SubscribeMessage('joinRoom')
  async joinRoom(
    @MessageBody() payload: { salons: string[] },
    @ConnectedSocket() socket: Socket,
  ) {
    console.log(payload.salons);
    payload.salons.map((salon) => socket.join(salon));
  }

  @SubscribeMessage('newMessage')
  onNewMessage(
    @MessageBody() payload: { message: Notification; room: string },
  ) {
    this.server.emit('onMessage', payload.message);
  }
}
