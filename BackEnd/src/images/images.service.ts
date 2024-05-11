import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async getImageByUserId(user_ID: number) {
    const findUser = await this.userRepository.find({ where: { user_ID } });
    return findUser[0].image;
  }
  putImageByUserId(user_ID: number, newImage: string) {
    return this.userRepository.update({ user_ID }, { image: newImage });
  }
}
