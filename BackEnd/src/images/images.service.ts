import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private cloudinaryService: CloudinaryService,
  ) {}
  async getImageByUserId(user_ID: number) {
    const [findUser] = await this.userRepository.find({ where: { user_ID } });
    return findUser.image;
  }
  async putImageByUserId(user_ID: number, file: Express.Multer.File) {
    const [findUser] = await this.userRepository.find({
      where: { user_ID },
    });
    if (findUser === undefined)
      throw new HttpException(
        'There is no image to delete',
        HttpStatus.BAD_REQUEST,
      );
    const url = findUser.image;
    const match = url.match(/\/v\d+\/([^/]+)\.\w+$/);
    if (match && match[1]) {
      const publicId = match[1];
      await cloudinary.uploader.destroy(publicId); // delete image in cloudinary
    } else {
      throw new HttpException(
        'Couldn´t extract Public ID from URL',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const response = await this.cloudinaryService.uploadFile(file); // Update image in cloudinary
    this.userRepository.update(
      // Update image in db
      { user_ID },
      { image: response.secure_url },
    );
    const [findUserchanged] = await this.userRepository.find({
      where: { user_ID },
    });
    return { user_ID, newImage: findUserchanged.image };
  }
}
