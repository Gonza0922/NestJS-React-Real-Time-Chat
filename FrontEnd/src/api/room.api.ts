import { CreateRoom } from "../interfaces/room.interface.ts";
import axios from "./axios.ts";

export const getRoomByNameRequest = async (roomName: string) => {
  //Select Room By Name
  const request = await axios.get(`/rooms/getByName/${roomName}`);
  return request.data;
};

export const getRoomsByUserRequest = async (user_ID: number) => {
  //Select Room By User
  const request = await axios.get(`/rooms/getByUser/${user_ID}`);
  return request.data;
};

export const postRoomRequest = async (dataRoom: CreateRoom) => {
  //Create a room
  const request = await axios.post(`/rooms/post`, dataRoom);
  return request.data;
};
