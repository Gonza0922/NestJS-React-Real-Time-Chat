import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/rooms.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Room]), TypeOrmModule.forFeature([User])],
  providers: [RoomsService, UsersService],
  controllers: [RoomsController],
})
export class RoomsModule {}
