import { useEffect, useState } from "react";
import { getMessagesReceiverRequest } from "../api/messages.api";
import { Message } from "../interfaces/message.interfaces";

export const useGetAllMessages = (receiver: string, authName: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  useEffect(() => {
    setMessages([]);
    const getMessagesReceiver = async () => {
      let data = await getMessagesReceiverRequest(receiver, { sender: authName });
      if (data) {
        for (let i = 0; i < data.length; i++) {
          data[i].sender = data[i].sender.name;
          data[i].receiver = data[i].receiver.name;
        }
      }
      setMessages((prevMessages) => [...prevMessages, ...data]);
    };
    getMessagesReceiver();
  }, [receiver]);
  return { messages, setMessages };
};
