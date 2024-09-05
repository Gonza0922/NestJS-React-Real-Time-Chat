import axios from "./axios.ts";

export const getAllUsersRequest = async () => {
  //Select all users
  const request = await axios.get("/users/getAll", {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  return request.data;
}; //[USED 2]

export const getUserIdRequest = async (user_ID: number) => {
  //Select the user that matches the user_ID sent by parameter
  const request = await axios.get(`/users/get/${user_ID}`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  return request.data;
}; //[USED]
