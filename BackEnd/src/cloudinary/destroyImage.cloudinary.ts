import { HttpException, HttpStatus } from '@nestjs/common';
import { RegisterUserDto } from 'src/users/dto/users.dto';
import { v2 as cloudinary } from 'cloudinary';

export const destroyImageCloudinary = async (findUser: RegisterUserDto) => {
  if (findUser === undefined)
    throw new HttpException(
      'There is no image to delete',
      HttpStatus.BAD_REQUEST,
    );
  const url = findUser.image;
  const match = url.match(/\/v\d+\/([^/]+)\.\w+$/);
  if (match && match[1]) {
    const publicId = match[1];
    await cloudinary.uploader.destroy(publicId);
  } else {
    throw new HttpException(
      'Couldn´t extract Public ID from URL',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
