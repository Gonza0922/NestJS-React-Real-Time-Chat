import { IsString, IsUrl } from 'class-validator';

export class UpdateImageDto {
  @IsString()
  @IsUrl()
  image: string;
}
