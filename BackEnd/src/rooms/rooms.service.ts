import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './rooms.entity';
import { Repository } from 'typeorm';
import { CreateRoomDto } from './rooms.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room) private roomRepository: Repository<Room>,
  ) {}
  async getRoomByName(roomName: string) {
    const findRoom = await this.roomRepository.find({
      relations: ['creator', 'member'],
      where: { name: roomName },
    });
    return findRoom;
  }
  postRoom(newRoom: CreateRoomDto) {
    const newRoomCreated = this.roomRepository.create(newRoom);
    return this.roomRepository.save(newRoomCreated);
  }
}
