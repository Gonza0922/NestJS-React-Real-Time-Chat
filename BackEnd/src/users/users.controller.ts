import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/users.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(AuthGuard)
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
  @Put('/put/:user_ID')
  putUserEndpoint(
    @Body() data: UpdateUserDto,
    @Param('user_ID', ParseIntPipe) user_ID: number,
  ) {
    return this.userService.putUserById(user_ID, data);
  }
}
