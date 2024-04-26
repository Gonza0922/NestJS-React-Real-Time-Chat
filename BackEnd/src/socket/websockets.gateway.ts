import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from 'src/messages/messages.service';

@WebSocketGateway({ cors: 'http://localhost:5173' })
export class WebSocketsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private messageService: MessagesService) {}
  @WebSocketServer()
  server: Server;
  handleConnection(client: Socket) {
    console.log(`client connected: ${client.id}`);
  }
  handleDisconnect(client: Socket) {
    console.log(`client disconnected: ${client.id}`);
  }
  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: string,
  ) {
    const { userName } = client.handshake.auth;
    const finalData = { person: userName, content: data };
    client.broadcast.emit('message', finalData);
    this.messageService.postMessage(finalData);
  }
}
