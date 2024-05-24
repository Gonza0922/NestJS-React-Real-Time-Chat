import { useEffect, useState } from "react";
import { RegisterData } from "../interfaces/user.interfaces";
import { getAllUsersRequest } from "../api/users.api";
import { useSocketContext } from "../contexts/SocketContext";
import { getRoomsByUserRequest } from "../api/room.api";
import { useUserContext } from "../contexts/UserContext";

export const useGetAllUsers = (authName: string) => {
  const [users, setUsers] = useState<RegisterData[]>([]);
  const { socket } = useSocketContext();
  useEffect(() => {
    const getAllUsers = async () => {
      const data = await getAllUsersRequest();
      const finalData = data.filter((element: RegisterData) => element.name !== authName);
      setUsers([...finalData]);
    };
    getAllUsers();
  }, [socket]);
  return { users };
};

export const useGetAllUsersAndRooms = (authName: string) => {
  const [usersAndRooms, setUsersAndRooms] = useState<RegisterData[]>([]);
  const { socket } = useSocketContext();
  const { user } = useUserContext();
  useEffect(() => {
    const getAllUsersAndRooms = async () => {
      const userdata = await getAllUsersRequest();
      const roomsdata = await getRoomsByUserRequest(user.user_ID);
      const finalData = userdata.filter((element: RegisterData) => element.name !== authName);
      setUsersAndRooms([...finalData, ...roomsdata]);
    };
    getAllUsersAndRooms();
  }, [socket]);
  return { usersAndRooms };
};
