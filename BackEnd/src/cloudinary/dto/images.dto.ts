import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class UserImageDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'password must contain at least one uppercase letter and a number',
  })
  password: string;
  @IsString()
  image: string;
}
