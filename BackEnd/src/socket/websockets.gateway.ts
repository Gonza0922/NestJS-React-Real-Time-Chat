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
import { UsersService } from 'src/users/users.service';

@WebSocketGateway({ cors: 'http://localhost:5173' })
export class WebSocketsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private messageService: MessagesService,
    private usersService: UsersService,
  ) {}
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
  async handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: string,
  ) {
    const { userName, receiver } = socket.handshake.auth;
    const finalData = { sender: userName, content: data };
    const receiverUser = await this.usersService.getUserByName(receiver);
    this.clients.forEach(async (client: ClientDto) => {
      if (parseInt(client.user) === receiverUser.user_ID) {
        const senderUser = await this.usersService.getUser(userName);
        this.server
          .to(client.id)
          .emit('message', { ...finalData, sender: senderUser.name });
      }
    });
    this.messageService.postMessage({
      ...finalData,
      receiver: receiverUser.user_ID,
    });
  }
}
