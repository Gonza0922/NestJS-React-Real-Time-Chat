import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LoginUserDto, RegisterUserDto } from '../users/dto/users.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { UsersService } from 'src/users/users.service';
import { Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}
  @Post('/register')
  registerUser(@Res() res: Response, @Body() newUser: RegisterUserDto) {
    return this.authService.signUp(res, newUser);
  }
  @Post('/login')
  loginUser(@Res() res: Response, @Body() user: LoginUserDto) {
    return this.authService.signIn(res, user);
  }
  @ApiBearerAuth()
  @Post('/logout')
  @UseGuards(AuthGuard)
  logoutUser(@Res() res: Response) {
    return this.authService.signOut(res);
  }
  @ApiBearerAuth()
  @Get('/verify')
  @UseGuards(AuthGuard)
  verifyUser(@Req() req: Request) {
    return this.usersService.getUser(req['user'].user_ID);
  }
}
