import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}
  @Get('/get/:user_ID')
  getImageByUserIdEndpoint(@Param('user_ID', ParseIntPipe) user_ID: number) {
    return this.imagesService.getImageByUserId(user_ID);
  }
  @Put('/put/:user_ID')
  @UseInterceptors(FileInterceptor('image')) // 'image' debe coincidir con el nombre del campo del formulario
  putImageByUserIdEndpoint(
    @Param('user_ID', ParseIntPipe) user_ID: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.imagesService.putImageByUserId(user_ID, file);
  }
}
