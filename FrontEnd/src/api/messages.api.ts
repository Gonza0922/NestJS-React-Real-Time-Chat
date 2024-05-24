import { Message } from "../interfaces/message.interfaces.ts";
import axios from "./axios.ts";

export const getAllMessagesRequest = async () => {
  //Select all messages
  const request = await axios.get("/messages/getAll");
  return request.data;
};

export const getMessagesReceiverRequest = async (data: object) => {
  //Select all messages from a sender and receiver
  const request = await axios.post("/messages/getByReceiver", data);
  return request.data;
};

export const postMessagesRequest = async (newData: Message) => {
  //Create a message
  const request = await axios.post("/messages/post", newData);
  return request.data;
};
