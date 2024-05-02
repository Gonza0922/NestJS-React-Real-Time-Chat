import { useEffect, useState } from "react";
import { getMessagesReceiverRequest } from "../api/messages.api";
import { Message } from "../interfaces/message.interfaces";

export const useGetAllMessages = (receiver: string, authName: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  useEffect(() => {
    setMessages([]);
    const getMessagesReceiver = async () => {
      const data = await getMessagesReceiverRequest(receiver, { sender: authName });
      setMessages((prevMessages) => [...prevMessages, ...data]);
    };
    getMessagesReceiver();
  }, [receiver]);
  return { messages, setMessages };
};
