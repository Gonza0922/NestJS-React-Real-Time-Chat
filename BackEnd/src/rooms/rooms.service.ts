import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './rooms.entity';
import { Repository } from 'typeorm';
import { CompleteRoomWithMembersInStringDto, CreateRoomDto } from './rooms.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room) private roomRepository: Repository<Room>,
  ) {}

  private formatRooms(rooms: CompleteRoomWithMembersInStringDto[]) {
    return rooms.map((room) => ({
      ...room,
      members: room.members
        .split(',')
        .map((item: string) => parseInt(item, 10)),
    }));
  }

  async getRoomByName(roomName: string) {
    const findRooms = await this.roomRepository
      .createQueryBuilder()
      .select(['name', 'image', 'createdAt', 'creatorUserID as creator'])
      .addSelect('GROUP_CONCAT(memberUserID ORDER BY memberUserID)', 'members')
      .where('name = :roomName', { roomName })
      .groupBy('name')
      .addGroupBy('image')
      .addGroupBy('createdAt')
      .addGroupBy('creator')
      .getRawMany();
    return this.formatRooms(findRooms);
  }

  async getRoomsByUser(user_ID: number) {
    const findRooms = await this.roomRepository
      .createQueryBuilder()
      .select(['name', 'image', 'createdAt', 'creatorUserID as creator'])
      .addSelect('GROUP_CONCAT(memberUserID ORDER BY memberUserID)', 'members')
      .where('(memberUserID = :user_ID OR creatorUserID = :user_ID)', {
        user_ID,
      })
      .groupBy('name')
      .addGroupBy('image')
      .addGroupBy('createdAt')
      .addGroupBy('creator')
      .getRawMany();
    return this.formatRooms(findRooms);
  }

  postRoom(newRoom: CreateRoomDto) {
    let { image } = newRoom;
    const { name, creator, members } = newRoom;
    const defaultImage = process.env.ROOM_NONE_IMAGE;
    if (!image) image = defaultImage;
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
