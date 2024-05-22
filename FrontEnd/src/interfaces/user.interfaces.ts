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
}

export interface ChildrenType {
  children: React.ReactNode;
}
