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
