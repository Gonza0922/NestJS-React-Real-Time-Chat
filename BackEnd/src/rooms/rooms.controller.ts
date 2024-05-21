import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './rooms.dto';

@Controller('rooms')
export class RoomsController {
  constructor(private roomsService: RoomsService) {}
  @Get('/get/:roomName')
  getAllMessagesEndpoint(@Param('roomName') roomName: string) {
    return this.roomsService.getRoomByName(roomName);
  }
  @Post('/post')
  createMessageEndpoint(@Body() newRoom: CreateRoomDto) {
    return this.roomsService.postRoom(newRoom);
  }
}
