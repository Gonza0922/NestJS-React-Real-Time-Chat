import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { destroyImageCloudinary } from 'src/cloudinary/destroyImage.cloudinary';
import { Room } from 'src/rooms/rooms.entity';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private cloudinaryService: CloudinaryService,
    @InjectRepository(Room) private roomRepository: Repository<Room>,
  ) {}

  async getImageByUserId(user_ID: number) {
    try {
      const findUser = await this.userRepository.findOne({
        where: { user_ID },
      });
      return findUser.image;
    } catch (e) {
      console.error(e);
      throw new HttpException(
        'Error recovering user image by user_ID',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async putImageByUserId(user_ID: number, file: Express.Multer.File) {
    try {
      const findUser = await this.userRepository.findOne({
        where: { user_ID },
      });
      if (findUser.image !== process.env.NONE_IMAGE)
        destroyImageCloudinary(findUser);
      const response = await this.cloudinaryService.uploadFile(file); // Create image in cloudinary
      this.userRepository.update({ user_ID }, { image: response.secure_url });
      const findUserchanged = await this.userRepository.findOne({
        where: { user_ID },
      });
      return { user_ID, newImage: findUserchanged.image };
    } catch (e) {
      console.error(e);
      throw new HttpException(
        'Error updating user image by user_ID',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteImageByUserId(user_ID: number) {
    try {
      const findUser = await this.userRepository.findOne({
        where: { user_ID },
      });
      if (findUser.image !== process.env.NONE_IMAGE)
        destroyImageCloudinary(findUser);
      this.userRepository.update(
        { user_ID },
        { image: process.env.NONE_IMAGE },
      );
      return { message: `Image delete of user ${findUser.name}` };
    } catch (e) {
      console.error(e);
      throw new HttpException(
        'Error removing user image by user_ID',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async putImageByRoom(room: string, file: Express.Multer.File) {
    try {
      const response = await this.cloudinaryService.uploadFile(file); // Create image in cloudinary
      this.roomRepository.update(
        { name: room },
        { image: response.secure_url },
      );
      const findUserchanged = await this.roomRepository.findOne({
        where: { name: room },
      });
      return { room, newImage: findUserchanged.image };
    } catch (e) {
      console.error(e);
      throw new HttpException(
        'Error updating room image by room',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
