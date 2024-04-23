import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

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
}
