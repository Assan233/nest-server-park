import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
// import {  } from "@nestjs/platform-socket.io";

@WebSocketGateway(7001, {
  cors: true,
  namespace: 'events',
})
export class SocketGateway {
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any) {
    client.emit('message', 'return message');
  }
}
