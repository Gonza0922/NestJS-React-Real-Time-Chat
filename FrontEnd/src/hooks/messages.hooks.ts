import { useEffect, useState } from "react";
import { getAllMessagesRequest } from "../api/messages.api";
import { Message } from "../interfaces/message.interfaces";

export const useGetAllMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  useEffect(() => {
    const getAllMessages = async () => {
      const data = await getAllMessagesRequest();
      console.log(data);
      setMessages([...messages, ...data]);
    };
    getAllMessages();
  }, []);
  return { messages, setMessages };
};
