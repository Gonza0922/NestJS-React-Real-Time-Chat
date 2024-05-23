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
    let finalData = [];
    const findRooms = await this.roomRepository
      .createQueryBuilder()
      .select('name')
      .addSelect('image')
      .addSelect('GROUP_CONCAT(memberUserID ORDER BY memberUserID)', 'members')
      .where('name = :roomName', { roomName })
      .groupBy('name')
      .addGroupBy('image')
      .getRawMany();
    findRooms.forEach((room) => {
      finalData.push({
        ...room,
        members: room.members.split(',').map(function (item: string) {
          return parseInt(item, 10);
        }),
      });
    });
    return finalData;
  }

  async getRoomsByUser(user_ID: number) {
    let finalData = [];
    const findRooms = await this.roomRepository
      .createQueryBuilder()
      .select('name')
      .addSelect('image')
      .addSelect('GROUP_CONCAT(memberUserID ORDER BY memberUserID)', 'members')
      .where('(memberUserID = :user_ID OR creatorUserID = :user_ID)', {
        user_ID,
      })
      .groupBy('name')
      .addGroupBy('image')
      .getRawMany();
    findRooms.forEach((room) => {
      finalData.push({
        ...room,
        members: room.members.split(',').map(function (item: string) {
          return parseInt(item, 10);
        }),
      });
    });
    return finalData;
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
