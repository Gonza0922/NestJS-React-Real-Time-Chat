import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  uploadFile(
    file: Express.Multer.File,
  ): Promise<UploadApiErrorResponse | UploadApiResponse> {
    try {
      return new Promise((resolve, reject) => {
        const upload = v2.uploader.upload_stream((error, result) => {
          if (error) reject(error);
          resolve(result);
        });
        streamifier.createReadStream(file.buffer).pipe(upload);
      });
    } catch (error) {
      console.error(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
