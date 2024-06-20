import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/rooms.entity';
import { Repository } from 'typeorm';
import {
  CompleteRoomWithMembersInStringDto,
  CreateRoomDto,
} from './dto/rooms.dto';

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
    try {
      const findRooms = await this.roomRepository
        .createQueryBuilder()
        .select(['name', 'image', 'createdAt', 'creatorUserID as creator'])
        .addSelect(
          'GROUP_CONCAT(memberUserID ORDER BY memberUserID)',
          'members',
        )
        .where('name = :roomName', { roomName })
        .groupBy('name')
        .addGroupBy('image')
        .addGroupBy('createdAt')
        .addGroupBy('creator')
        .getRawMany();
      return this.formatRooms(findRooms);
    } catch (error) {
      console.error(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getRoomsByUser(user_ID: number) {
    try {
      const findRooms = await this.roomRepository
        .createQueryBuilder()
        .select(['name', 'image', 'createdAt', 'creatorUserID as creator'])
        .addSelect(
          'GROUP_CONCAT(memberUserID ORDER BY memberUserID)',
          'members',
        )
        .where('(memberUserID = :user_ID OR creatorUserID = :user_ID)', {
          user_ID,
        })
        .groupBy('name')
        .addGroupBy('image')
        .addGroupBy('createdAt')
        .addGroupBy('creator')
        .getRawMany();
      return this.formatRooms(findRooms);
    } catch (error) {
      console.error(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  postRoom(newRoom: CreateRoomDto) {
    try {
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
    } catch (error) {
      console.error(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
