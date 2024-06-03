import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];
    if (!authHeader)
      throw new HttpException(
        'Authorization header not found',
        HttpStatus.UNAUTHORIZED,
      );
    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token)
      throw new HttpException('Invalid token format', HttpStatus.UNAUTHORIZED);
    try {
      const { user_ID } = await this.jwtService.verifyAsync(token, {
        secret: process.env.TOKEN_SECURE,
      });
      const user = await this.usersService.getUser(user_ID);
      if (!user)
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      request['user'] = user;
      return true;
    } catch (err) {
      throw new HttpException(err, HttpStatus.UNAUTHORIZED);
    }
  }
}
