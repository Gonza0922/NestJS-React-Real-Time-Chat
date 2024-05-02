import { useEffect, useState } from "react";
import { RegisterData } from "../interfaces/user.interfaces";
import { getAllUsersRequest } from "../api/users.api";

export const useGetAllUsers = (authName: string) => {
  const [users, setUsers] = useState<RegisterData[]>([]);
  useEffect(() => {
    const getAllUsers = async () => {
      const data = await getAllUsersRequest();
      console.log(data);
      const finalData = data.filter((element: RegisterData) => element.name !== authName);
      setUsers([...users, ...finalData]);
    };
    getAllUsers();
  }, []);
  return { users };
};
