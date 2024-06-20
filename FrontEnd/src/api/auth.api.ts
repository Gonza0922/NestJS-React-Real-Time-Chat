import axios from "./axios.ts";
import { LoginData, RegisterData } from "../interfaces/user.interfaces.ts";

export const registerUserRequest = async (user: RegisterData) => {
  //Register a new user
  const request = await axios.post("/auth/register", user);
  return request.data;
};

export const loginUserRequest = async (user: LoginData) => {
  //Log in a user that matches the data sent
  const request = await axios.post("/auth/login", user);
  return request.data;
};

export const logoutUserRequest = async () => {
  //Log out a user
  const request = await axios.post(
    "/auth/logout",
    {},
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );
  return request.data;
};

export const verifyTokenUserRequest = async () => {
  //Check if the UserToken exists/matches to enter the user account
  const request = await axios.get("/auth/verify", {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  return request.data;
};
