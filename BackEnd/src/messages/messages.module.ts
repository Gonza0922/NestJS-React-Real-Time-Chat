import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/messages.entity';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { WebSocketsGateway } from '../socket/websockets.gateway';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/users.entity';
import { RoomsService } from 'src/rooms/rooms.service';
import { Room } from 'src/rooms/entities/rooms.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Room]),
  ],
  controllers: [MessagesController],
  providers: [MessagesService, WebSocketsGateway, UsersService, RoomsService],
})
export class MessagesModule {}
