import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { Password } from './users.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @Get('/getAll')
  getAllUsersEndpoint() {
    return this.userService.getAllUsers();
  }
  @Get('/get/:user_ID')
  getUserEndpoint(@Param() param: object) {
    return this.userService.getUser(param['user_ID']);
  }
  @Post('/post/password')
  getUserByPasswordEndpoint(@Body() hash: Password) {
    return this.userService.getUserByPassword(hash.password);
  }
}
