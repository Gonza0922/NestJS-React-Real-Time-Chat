import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRespository: Repository<User>,
  ) {}
  getAllUsers() {
    return this.userRespository.find();
  }
  getUser(user_ID: number) {
    return this.userRespository.find({ where: { user_ID } });
  }
}
