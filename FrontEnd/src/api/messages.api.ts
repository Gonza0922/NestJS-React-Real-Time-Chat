import axios from "./axios.ts";
import { CreateMessageDto } from "../../../BackEnd/src/messages/messages.dto.ts";

export const getAllMessagesRequest = async () => {
  //Select all messages
  const request = await axios.get("/messages/getAll");
  return request.data;
};

export const postMessagesRequest = async (newData: CreateMessageDto) => {
  //Create a message
  const request = await axios.post("/messages/post", newData);
  return request.data;
};
