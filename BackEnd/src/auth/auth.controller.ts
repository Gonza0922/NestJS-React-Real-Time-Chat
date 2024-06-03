import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
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
  @UsePipes(new ValidationPipe())
  registerUser(@Res() res: Response, @Body() newUser: RegisterUserDto) {
    return this.authService.signUp(res, newUser);
  }
  @Post('/login')
  @UsePipes(new ValidationPipe())
  loginUser(@Res() res: Response, @Body() user: LoginUserDto) {
    return this.authService.signIn(res, user);
  }
  @Post('/logout')
  @UseGuards(AuthGuard)
  logoutUser(@Res() res: Response) {
    return this.authService.signOut(res);
  }
  @Get('/verify')
  @UseGuards(AuthGuard)
  verifyUser(@Req() req: any) {
    return this.usersService.getUser(req.user.user_ID);
  }
}
