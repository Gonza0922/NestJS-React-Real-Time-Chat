import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  sender: number;
  @IsNotEmpty()
  @IsString()
  content: string;
  @IsNotEmpty()
  @IsString()
  receiverName: string;
  @IsNotEmpty()
  @IsString()
  type: string;
}

export interface finalReceiverDto {
  name: string;
  data: number[] | undefined;
}
