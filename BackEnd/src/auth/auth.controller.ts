import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LoginUserDto, RegisterUserDto } from '../users/users.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { UsersService } from 'src/users/users.service';
import { Response } from 'express';

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
  @Get('/verify')
  @UseGuards(AuthGuard)
  verifyUser(@Req() req: any) {
    return this.usersService.getUser(req.user.user_ID);
  }
}
