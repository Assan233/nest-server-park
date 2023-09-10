import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
// import {  } from "@nestjs/platform-socket.io";
import { SOCKET_EVENTS } from '@/const';

const roomId = 888;

@WebSocketGateway(7001, {
  cors: true,
  namespace: 'rtc',
})
export class SocketGateway {
  /**
   * 创建房间
   * @param {any} client:any
   */
  @SubscribeMessage(SOCKET_EVENTS.createRoom)
  handleCreateRoom(client: any) {
    // 创建房间 (首次加入就是创建)
    client.join(roomId);
    client.emit(SOCKET_EVENTS.createRoom, roomId);
  }

  /**
   * 加入房间
   * @param {any} client:any
   * @param {number} roomId:number
   */
  @SubscribeMessage(SOCKET_EVENTS.connectRoom)
  handleConnectRoom(client: any, roomId: number) {
    // 加入房间
    client.join(roomId);
    client.emit(SOCKET_EVENTS.connectRoom, `成功加入房间：${roomId}`);
    console.log('socket rooms:', client.rooms);
  }

  /**
   * 接收到推送的视频流
   * @param {any} client:any
   */
  @SubscribeMessage(SOCKET_EVENTS.postMedia)
  handlePostMedia(client: any, data: { roomId: number; media: any }) {
    // 将接收到的视频流 推送到 房间内所有成员
    const { roomId, media } = data;
    client.to(roomId).emit(SOCKET_EVENTS.receiveMedia, media);
  }
}
