export interface LoginData {
  user_ID: number;
  email: string;
  password: string;
}

export interface RegisterData {
  user_ID: number;
  name: string;
  email: string;
  password: string;
  image: string;
  createdAt: string;
}

export interface ChildrenType {
  children: React.ReactNode;
}

export interface UsersAndRooms {
  user_ID: number;
  name: string;
  email: string;
  password: string;
  image: string;
  members: number[];
  createdAt: string;
  creator: number;
}
