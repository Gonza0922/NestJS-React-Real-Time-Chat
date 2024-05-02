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
import { ClientDto } from './websockets.dto';

@WebSocketGateway({ cors: 'http://localhost:5173' })
export class WebSocketsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private messageService: MessagesService) {}
  @WebSocketServer()
  server: Server;
  private clients: ClientDto[] = [];
  handleConnection(socket: Socket) {
    const { userName } = socket.handshake.auth;
    console.log(`${userName} with id: ${socket.id} is connected `);
    this.clients.push({ user: userName, id: socket.id });
  }
  handleDisconnect(socket: Socket) {
    console.log(`${socket.id} Disconnected`);
  }
  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: string,
  ) {
    const { userName, receiver } = socket.handshake.auth;
    const finalData = { sender: userName, content: data };
    this.clients.forEach((client: ClientDto) => {
      if (client.user === receiver)
        this.server.to(client.id).emit('message', finalData);
    });
    // client.broadcast.emit('message', finalData); enviar a todos
    this.messageService.postMessage({ ...finalData, receiver });
  }
}
