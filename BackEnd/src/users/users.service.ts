import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
    try {
      return this.userRepository.find({ order: { name: 'ASC' } });
    } catch (error) {
      console.error(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getUser(user_ID: number) {
    try {
      return await this.userRepository.findOne({
        where: { user_ID },
      });
    } catch (error) {
      console.error(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getUserByName(name: string) {
    try {
      return await this.userRepository.findOne({ where: { name } });
    } catch (error) {
      console.error(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async putUserById(user_ID: number, data: UpdateUserDto) {
    try {
      await this.userRepository.update(
        { user_ID },
        { name: data.name, email: data.email },
      );
      return this.userRepository.findOne({ where: { user_ID } });
    } catch (error) {
      console.error(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
