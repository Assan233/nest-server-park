import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { SOCKET_EVENTS } from '@/const';

const roomId = 888;

@WebSocketGateway(7001, {
  cors: true,
  namespace: 'rtc',
})
export class SocketGateway {
  /** ===== 建立信令服务连接 ====== */
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
  handleConnectRoom(client: any, roomId: string) {
    // 加入房间
    client.join(roomId);
    client.emit(SOCKET_EVENTS.connectRoom, `成功加入房间：${roomId}`);
    console.log('socket rooms:', client.rooms);
  }

  /**
   * 接收到推送的视频流
   * @param {Socket} client:any
   */
  @SubscribeMessage(SOCKET_EVENTS.postMedia)
  handlePostMedia(client: Socket, data: { roomId: string; media: any }) {
    // 将接收到的视频流 推送到 房间内所有成员
    const { roomId, media } = data;
    client.to(roomId).emit(SOCKET_EVENTS.receiveMedia, media);
  }

  /** ===== 媒体协商 ====== */
  /**
   * 接收到发起者推送的SDP
   * @param {any} client:any
   * @param {number} data:{roomId:number;media:any}
   */
  @SubscribeMessage(SOCKET_EVENTS.postOfferSDP)
  handlePostOfferSDP(
    client: Socket,
    data: { offerSDP: RTCSessionDescriptionInit; roomId: string },
  ) {
    // 将 offerSDP 推送到 房间内所有成员
    const { roomId } = data;
    console.log(data.roomId, SOCKET_EVENTS.receiveOfferSDP);
    client.to(roomId).emit(SOCKET_EVENTS.receiveOfferSDP, data);
  }

  /**
   * 接收到 应答者 推送的SDP
   * @param {any} client:any
   * @param {number} data:{roomId:number;media:any}
   */
  @SubscribeMessage(SOCKET_EVENTS.postAnswerSDP)
  handlePostAnswerSDP(
    client: Socket,
    data: { answerSDP: RTCSessionDescriptionInit; roomId: string },
  ) {
    // 将 answerSDP 推送到 房间内所有成员
    const { roomId } = data;
    console.log(data, 'handlePostOfferSDP');

    client.to(roomId).emit(SOCKET_EVENTS.receiveAnswerSDP, data);
  }
}
