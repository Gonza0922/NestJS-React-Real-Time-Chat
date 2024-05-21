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
  private usersHandle: string[] = [];
  async handleConnection(@ConnectedSocket() socket: Socket) {
    const { userName } = socket.handshake.auth;
    if (userName) {
      console.log(`${userName} with id: ${socket.id} is connected `);
      this.clients.push({ user: userName, id: socket.id, socket });
      const user = await this.usersService.getUser(userName);
      if (!this.usersHandle.includes(user.name))
        this.usersHandle.push(user.name);
      this.server.emit('getOnlineUsers', this.usersHandle);
    }
  }
  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    const { userName } = socket.handshake.auth;
    if (userName) {
      console.log(`${socket.id} Disconnected`);
      this.clients.filter((client) => client.id !== socket.id);
      const user = await this.usersService.getUser(userName);
      this.usersHandle = this.usersHandle.filter((name) => name !== user.name);
      this.server.emit('getOnlineUsers', this.usersHandle);
    }
  }
  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() content: string,
  ) {
    const { userName, receiver } = socket.handshake.auth;
    const finalData = { sender: userName, content };
    const receiverUser = await this.usersService.getUserByName(receiver);
    this.clients.forEach(async (client: ClientDto) => {
      if (client.user === receiverUser.user_ID) {
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
  @SubscribeMessage('createRoom')
  async createRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() roomName: string,
  ) {
    socket.join(roomName);
    console.log(`Client ${socket.id} create room ${roomName}`);
  }
  @SubscribeMessage('addClientToRoom')
  handleAddClientToRoom(
    socket: Socket,
    data: { room: string; clientUser_ID: number },
  ) {
    const { room, clientUser_ID } = data;
    this.clients.forEach(async (client: ClientDto) => {
      if (clientUser_ID === client.user) {
        client.socket.join(room);
        console.log(`Client ${clientUser_ID} joined room ${room}`);
      } else {
        console.log(`Client ${clientUser_ID} not found`);
      }
    });
  }
}
