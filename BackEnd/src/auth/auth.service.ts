import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/users.entity';
import { LoginUserDto, RegisterUserDto } from '../users/dto/users.dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async signUp(res: Response, newUser: RegisterUserDto) {
    try {
      const { email, password } = newUser;
      const findEmail = await this.userRepository.find({ where: { email } });
      if (findEmail.length > 0)
        throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
      const hashedPassword = await bcrypt.hash(password, 10);
      const userCreated = this.userRepository.create({
        ...newUser,
        password: hashedPassword,
        image: process.env.NONE_IMAGE,
      });
      const userSaved = await this.userRepository.save(userCreated);
      const payload = { user_ID: userSaved.user_ID };
      const UserToken = await this.jwtService.signAsync(payload);
      res.status(201).json({ user: userSaved, token: UserToken });
    } catch (error) {
      console.error(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async signIn(res: Response, user: LoginUserDto) {
    try {
      const { email, password } = user;
      const findUser = await this.userRepository.find({ where: { email } });
      if (findUser.length === 0)
        throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
      const isMatch = await bcrypt.compare(password, findUser[0].password);
      if (!isMatch)
        throw new HttpException('Incorrect Password', HttpStatus.BAD_REQUEST);
      const payload = { user_ID: findUser[0].user_ID };
      const UserToken = await this.jwtService.signAsync(payload);
      res.status(200).json({ user: findUser[0], token: UserToken });
    } catch (error) {
      console.error(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async signOut(res: Response) {
    try {
      res.status(200).json({ message: 'Disconnected' });
    } catch (error) {
      console.error(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
