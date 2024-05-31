import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/users.entity';
import { LoginUserDto, RegisterUserDto } from '../users/users.dto';
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
      res.cookie('UserToken', UserToken);
      throw new HttpException(userSaved, HttpStatus.CREATED);
    } catch (e) {
      console.error(e);
      throw new HttpException(
        'Error Sign Up',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
      res.cookie('UserToken', UserToken);
      throw new HttpException(findUser[0], HttpStatus.OK);
    } catch (e) {
      console.error(e);
      throw new HttpException('Login error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async signOut(res: Response) {
    try {
      res.cookie('UserToken', '', { expires: new Date(0) });
      throw new HttpException('Disconnected', HttpStatus.OK);
    } catch (e) {
      console.error(e);
      throw new HttpException('Logout error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
