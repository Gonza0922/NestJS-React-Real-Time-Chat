import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from './users.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import * as bcrypt from 'bcrypt';

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
  async postUser(newUser: RegisterUserDto) {
    const hashedPassword = await bcrypt.hash(newUser.password, 10);
    const result = this.userRespository.create({
      ...newUser,
      password: hashedPassword,
    });
    return this.userRespository.save(result);
  }
}
