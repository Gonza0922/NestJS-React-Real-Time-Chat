import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from 'src/users/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [AuthService, UsersService],
})
export class AuthModule {}
