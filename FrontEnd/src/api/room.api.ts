import { CreateRoom } from "../interfaces/room.interface.ts";
import axios from "./axios.ts";

export const getRoomByNameRequest = async (roomName: string) => {
  //Select Room By Name
  const request = await axios.get(`/rooms/getByName/${roomName}`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  return request.data;
};

export const getRoomsByUserRequest = async (user_ID: number) => {
  //Select Room By User
  const request = await axios.get(`/rooms/getByUser/${user_ID}`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  return request.data;
};

export const postRoomRequest = async (dataRoom: CreateRoom) => {
  //Create a room
  const request = await axios.post(`/rooms/post`, dataRoom, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  return request.data;
};
