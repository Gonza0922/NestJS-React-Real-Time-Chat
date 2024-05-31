export interface CreateRoomDto {
  name: string;
  creator: number;
  url?: string;
  image?: string;
  members?: number[];
}

export interface CompleteRoomDto extends CreateRoomDto {
  createdAt: Date;
}

export interface CompleteRoomWithMembersInStringDto
  extends Omit<CompleteRoomDto, 'members'> {
  members: string;
}
