import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Password, UpdateUserDto } from './users.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @Get('/getAll')
  getAllUsersEndpoint() {
    return this.userService.getAllUsers();
  }
  @Get('/get/:user_ID')
  getUserEndpoint(@Param('user_ID', ParseIntPipe) user_ID: number) {
    return this.userService.getUser(user_ID);
  }
  @Get('/user_ID/get/:name')
  getUserByNameEndpoint(@Param() name: string) {
    return this.userService.getUserByName(name);
  }
  @Post('/post/password')
  getUserByPasswordEndpoint(@Body() hash: Password) {
    return this.userService.getUserByPassword(hash.password);
  }
  @Put('/put/:user_ID')
  @UsePipes(new ValidationPipe())
  putUserEndpoint(
    @Body() data: UpdateUserDto,
    @Param('user_ID', ParseIntPipe) user_ID: number,
  ) {
    return this.userService.putUserById(user_ID, data);
  }
}
