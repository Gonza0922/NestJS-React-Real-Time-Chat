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
    let { image } = newRoom;
    const { name, creator, members } = newRoom;
    const defaultImage = process.env.ROOM_NONE_IMAGE;
    if (!image) image = defaultImage;
    console.log({
      name,
      creator,
      members,
      image,
    });
    members.forEach((member) => {
      const newRoomCreated = this.roomRepository.create({
        name,
        creator,
        member,
        image,
      });
      return this.roomRepository.save(newRoomCreated);
    });
  }
}
