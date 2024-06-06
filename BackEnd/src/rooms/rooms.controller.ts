import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './rooms.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('rooms')
export class RoomsController {
  constructor(private roomsService: RoomsService) {}
  @Get('/getByName/:roomName')
  getRoomByNameEndpoint(@Param('roomName') roomName: string) {
    return this.roomsService.getRoomByName(roomName);
  }
  @Get('/getByUser/:user_ID')
  getRoomByUserEndpoint(@Param('user_ID', ParseIntPipe) user_ID: number) {
    return this.roomsService.getRoomsByUser(user_ID);
  }
  @Post('/post')
  createRoomEndpoint(@Body() newRoom: CreateRoomDto) {
    return this.roomsService.postRoom(newRoom);
  }
}
