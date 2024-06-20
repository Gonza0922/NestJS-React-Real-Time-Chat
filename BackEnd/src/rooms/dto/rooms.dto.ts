import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  creator: number;
  url?: string;
  image?: string;
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  members?: number[];
}

export interface CompleteRoomDto {
  name: string;
  creator: number;
  url?: string;
  image?: string;
  members?: number[];
  createdAt: Date;
}

export interface CompleteRoomWithMembersInStringDto
  extends Omit<CompleteRoomDto, 'members'> {
  members: string;
}
