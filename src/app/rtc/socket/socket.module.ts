import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { SocketGateway } from './socket.gateway';

@Module({
  controllers: [],
  providers: [SocketService, SocketGateway],
})
export class SocketModule {}
