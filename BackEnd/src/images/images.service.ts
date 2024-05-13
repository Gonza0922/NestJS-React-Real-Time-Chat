import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { destroyImageCloudinary } from 'src/cloudinary/destroyImage.cloudinary';

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
    destroyImageCloudinary(findUser);
    const response = await this.cloudinaryService.uploadFile(file); // Create image in cloudinary
    this.userRepository.update({ user_ID }, { image: response.secure_url });
    const [findUserchanged] = await this.userRepository.find({
      where: { user_ID },
    });
    return { user_ID, newImage: findUserchanged.image };
  }
  async deleteImageByUserId(user_ID: number) {
    const [findUser] = await this.userRepository.find({
      where: { user_ID },
    });
    destroyImageCloudinary(findUser);
    this.userRepository.update(
      { user_ID },
      {
        image:
          'https://res.cloudinary.com/dz5q0a2nd/image/upload/v1715366693/chat/user-not-image_d3f6t1.webp',
      },
    );
    return { message: `Image delete of user ${findUser.name}` };
  }
}
