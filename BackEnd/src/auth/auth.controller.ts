import { Body, Controller, Post } from '@nestjs/common';
import { LoginUserDto, RegisterUserDto } from '../users/users.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/register')
  registerUser(@Body() newUser: RegisterUserDto) {
    return this.authService.signUp(newUser);
  }
  @Post('/login')
  loginUser(@Body() user: LoginUserDto) {
    return this.authService.signIn(user);
  }
}
