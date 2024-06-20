import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { User } from 'src/users/entities/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Room } from 'src/rooms/entities/rooms.entity';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), TypeOrmModule.forFeature([Room])],
  controllers: [ImagesController],
  providers: [ImagesService, CloudinaryService, UsersService],
})
export class ImagesModule {}
