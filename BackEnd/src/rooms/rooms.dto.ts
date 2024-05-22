export interface CreateRoomDto {
  name: string;
  creator: number;
  members: number[];
  image?: string;
}
