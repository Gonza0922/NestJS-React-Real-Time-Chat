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
import { ClientDto } from './dto/websockets.dto';
import { UsersService } from 'src/users/users.service';
import { RoomsService } from 'src/rooms/rooms.service';
import { CompleteRoomDto, CreateRoomDto } from 'src/rooms/dto/rooms.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

@WebSocketGateway({ cors: 'http://localhost:5173' })
export class WebSocketsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private messageService: MessagesService,
    private usersService: UsersService,
    private roomsService: RoomsService,
  ) {}
  @WebSocketServer()
  server: Server;
  private clients: ClientDto[] = [];
  private usersHandle: string[] = [];

  async handleConnection(@ConnectedSocket() socket: Socket) {
    try {
      const { userName } = socket.handshake.auth;
      if (userName) {
        console.log(`${userName} with id: ${socket.id} is connected `);
        this.clients.push({ user: userName, id: socket.id, socket });
        const user = await this.usersService.getUser(userName);
        if (!this.usersHandle.includes(user.name))
          this.usersHandle.push(user.name);
        this.server.emit('getOnlineUsers', this.usersHandle);
      }
    } catch (error) {
      console.error(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    try {
      const { userName } = socket.handshake.auth;
      if (userName) {
        console.log(`${socket.id} Disconnected`);
        this.clients.filter((client) => client.id !== socket.id);
        const user = await this.usersService.getUser(userName);
        this.usersHandle = this.usersHandle.filter(
          (name) => name !== user.name,
        );
        this.server.emit('getOnlineUsers', this.usersHandle);
      }
    } catch (error) {
      console.error(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() content: string,
  ) {
    try {
      let room: CompleteRoomDto;
      const { userName, receiverName } = socket.handshake.auth;
      const finalData = { sender: userName, content, receiverName };
      const receiverUser = await this.usersService.getUserByName(receiverName); // si es un grupo no va a existir
      if (!receiverUser) {
        const [findRoom] = await this.roomsService.getRoomByName(receiverName);
        //nos aseguramos de que el receiver es el nombre de una room existente
        room = findRoom;
      }

      this.clients.forEach(async (client: ClientDto) => {
        if (receiverUser) {
          // es un user
          if (client.user === receiverUser.user_ID) {
            const senderUser = await this.usersService.getUser(userName);
            this.server.to(client.id).emit('message', {
              ...finalData,
              sender: senderUser,
              type: 'user',
            });
          }
        } else {
          // es una room
          room.members.forEach(async (member: number) => {
            if (client.user === member) {
              const senderUser = await this.usersService.getUser(userName);
              this.server.to(client.id).emit('message', {
                ...finalData,
                sender: senderUser,
                type: 'room',
              });
            }
          });
        }
      });
      receiverUser
        ? this.messageService.postMessage({
            ...finalData,
            type: 'user',
          })
        : this.messageService.postMessage({
            ...finalData,
            type: 'room',
          });
    } catch (error) {
      console.error(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @SubscribeMessage('createRoom')
  async createRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: CreateRoomDto,
  ) {
    try {
      const { name, creator } = data;
      socket.join(name);
      console.log(`Client ${socket.id} create room ${name}`);
      this.roomsService.postRoom({ name, creator, members: [creator] });
    } catch (error) {
      console.error(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @SubscribeMessage('addClientToRoom')
  async handleAddClientToRoom(@MessageBody() data: CreateRoomDto) {
    try {
      const { name, creator, members } = data;
      members.forEach((member: number) => {
        this.clients.forEach(async (client: ClientDto) => {
          if (member === client.user) {
            client.socket.join(name);
            data.image;
            this.server.to(client.id).emit('addClientToRoom', {
              ...data,
              members: [...data.members, creator],
              image: data.url,
            });
            console.log(`Client ${member} joined room ${name}`);
          }
        });
      });
      this.roomsService.postRoom({ name, creator, members });
    } catch (error) {
      console.error(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
