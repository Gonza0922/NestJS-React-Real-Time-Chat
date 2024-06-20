import { Socket } from 'socket.io';

export interface ClientDto {
  user: number;
  id: string;
  socket: Socket;
}
