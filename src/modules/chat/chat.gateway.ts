import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): void {
    console.log('message:', data)
    client.emitWithAck('message', data)
  }

  handleConnection(client: Socket) {
    client._onconnect = () => {
      console.log('connected, id:', client.id)
    }
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id)
  }
}
