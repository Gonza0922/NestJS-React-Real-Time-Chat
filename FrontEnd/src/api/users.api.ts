import axios from "./axios.ts";

export const getAllUsersRequest = async () => {
  //Select all users
  const request = await axios.get("/users/getAll");
  return request.data;
};

export const getUserIdRequest = async (user_ID: number) => {
  //Select the user that matches the user_ID sent by parameter
  const request = await axios.get(`/users/get/${user_ID}`);
  return request.data;
};

export const getUserPasswordRequest = async (password: string) => {
  //Select the user that matches the user_ID sent by parameter
  const request = await axios.post(`/users/post/password`, { password: password });
  return request.data;
};
