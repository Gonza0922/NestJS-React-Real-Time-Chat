import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import { UpdateImageDto } from './images.dto';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}
  @Get('/get/:user_ID')
  getImageByUserIdEndpoint(@Param('user_ID', ParseIntPipe) user_ID: number) {
    return this.imagesService.getImageByUserId(user_ID);
  }
  @Put('/put/:user_ID')
  putImageByUserIdEndpoint(
    @Param('user_ID', ParseIntPipe) user_ID: number,
    @Body() newImage: UpdateImageDto,
  ) {
    return this.imagesService.putImageByUserId(user_ID, newImage.image);
  }
}
