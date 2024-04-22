import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto } from './users.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @Get('/getAll')
  getAllUsers() {
    return this.userService.getAllUsers();
  }
  @Get('/get/:user_ID')
  getUser(@Param() param: object) {
    return this.userService.getUser(param['user_ID']);
  }
  @Post('/post')
  createUser(@Body() newUser: RegisterUserDto) {
    return this.userService.postUser(newUser);
  }
}
