import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { UserToken } = request.cookies;
    if (!UserToken) {
      throw new HttpException(
        'Unauthorized, no token',
        HttpStatus.UNAUTHORIZED,
      );
    }
    try {
      const payload = await this.jwtService.verifyAsync(UserToken, {
        secret: process.env.TOKEN_SECURE,
      });
      request['user'] = payload;
    } catch {
      throw new HttpException(
        'Unauthorized, invalid token',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return true;
  }
}
