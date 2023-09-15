import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { SOCKET_EVENTS } from '@/const';

const roomId = 'assan-live-room';

@WebSocketGateway(7001, {
  cors: true,
  namespace: 'rtc',
})
export class SocketGateway {
  /** ===== 建立信令服务连接 ====== */
  /**
   * 创建房间
   * @param {Socket} client:Socket
   */
  @SubscribeMessage(SOCKET_EVENTS.createRoom)
  handleCreateRoom(client: Socket) {
    // 创建房间 (首次加入就是创建)
    client.join(roomId);
    client.emit(SOCKET_EVENTS.createRoom, roomId);
  }

  /**
   * 加入房间
   * @param {Socket} client:Socket
   * @param {number} roomId:number
   */
  @SubscribeMessage(SOCKET_EVENTS.connectRoom)
  handleConnectRoom(client: any, roomId: string) {
    // 加入房间
    client.join(roomId);
    client.emit(SOCKET_EVENTS.connectRoom, `成功加入房间：${roomId}`);
    console.log('socket rooms:', client.rooms);
  }

  /** ===== 媒体协商 ====== */
  /**
   * 接收到发起者推送的SDP
   * @param {Socket} client:any
   * @param {number} data:{roomId:number;media:any}
   */
  @SubscribeMessage(SOCKET_EVENTS.postOfferSDP)
  handlePostOfferSDP(
    client: Socket,
    data: { offerSDP: RTCSessionDescriptionInit; roomId: string },
  ) {
    // 将 offerSDP 推送到 房间内所有成员
    const { roomId } = data;
    // console.log(data.roomId, SOCKET_EVENTS.receiveOfferSDP);
    client.to(roomId).emit(SOCKET_EVENTS.receiveOfferSDP, data);
  }

  /**
   * 接收到 应答者 推送的SDP
   * @param {Socket} client:any
   * @param {number} data:{roomId:number;media:any}
   */
  @SubscribeMessage(SOCKET_EVENTS.postAnswerSDP)
  handlePostAnswerSDP(
    client: Socket,
    data: { answerSDP: RTCSessionDescriptionInit; roomId: string },
  ) {
    // 将 answerSDP 推送到 房间内所有成员
    const { roomId } = data;
    // console.log(data, 'handlePostOfferSDP');

    client.to(roomId).emit(SOCKET_EVENTS.receiveAnswerSDP, data);
  }

  /** ===== 网络协商 ====== */
  /**
   * 广播OfferCandidate（offer网络候选信息）
   * @param {any} client:any
   * @param {RTCIceCandidate} candidate: offer网络候选信息
   */
  @SubscribeMessage(SOCKET_EVENTS.offerCandidate)
  handleOfferCandidate(
    client: Socket,
    data: { candidate: RTCIceCandidate; roomId: string },
  ) {
    console.log('offerCandidate', data);
    // 将 offerCandidate 推送到 房间内所有成员
    const { roomId } = data;
    client.to(roomId).emit(SOCKET_EVENTS.offerCandidate, data);
  }

  /**
   * 广播answerCandidate
   * @param {any} client:any
   * @param {RTCIceCandidate} candidate: answerCandidate
   */
  @SubscribeMessage(SOCKET_EVENTS.answerCandidate)
  handleAnswerCandidate(
    client: Socket,
    data: { candidate: RTCIceCandidate; roomId: string },
  ) {
    console.log('answerCandidate');
    // 将 answerCandidate 推送给主播（只有他会监听事件 answerCandidate）
    const { roomId } = data;
    client.to(roomId).emit(SOCKET_EVENTS.answerCandidate, data);
  }
}
