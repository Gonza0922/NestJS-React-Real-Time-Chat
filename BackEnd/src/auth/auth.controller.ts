import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { LoginUserDto, RegisterUserDto } from '../users/users.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}
  @Post('/register')
  registerUser(@Body() newUser: RegisterUserDto) {
    return this.authService.signUp(newUser);
  }
  @Post('/login')
  loginUser(@Body() user: LoginUserDto) {
    return this.authService.signIn(user);
  }
  @Get('/verify')
  @UseGuards(AuthGuard)
  verifyUser(@Req() req: any) {
    return this.usersService.getUser(req.user.user_ID);
  }
}
