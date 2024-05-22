import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { UpdateUserDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  getAllUsers() {
    return this.userRepository.find();
  }
  async getUser(user_ID: number) {
    const [findUser] = await this.userRepository.find({ where: { user_ID } });
    return findUser;
  }
  async getUserByName(name: string) {
    const [findUser] = await this.userRepository.find({ where: { name } });
    return findUser;
  }
  async getUserByPassword(password: string) {
    const [findUser] = await this.userRepository.find({ where: { password } });
    return findUser;
  }
  async putUserById(user_ID: number, data: UpdateUserDto) {
    await this.userRepository.update(
      { user_ID },
      { name: data.name, email: data.email },
    );
    return this.userRepository.find({ where: { user_ID } });
  }
}
