import { useEffect, useState } from "react";
import { getMessagesReceiverRequest } from "../api/messages.api";
import { Message } from "../interfaces/message.interfaces";

export const useGetAllMessages = (
  receiver: { name: string; members: number[] | undefined },
  authName: string | null
) => {
  let finalReceiver;
  receiver && receiver.members
    ? (finalReceiver = { data: receiver.members, name: receiver.name })
    : (finalReceiver = { name: receiver.name });
  const [messages, setMessages] = useState<Message[]>([]);
  useEffect(() => {
    setMessages([]);
    const getMessagesReceiver = async () => {
      const send = { finalReceiver, authName };
      let data = await getMessagesReceiverRequest(send);
      if (data) {
        for (let i = 0; i < data.length; i++) {
          data[i].sender = data[i].sender.name;
        }
      }
      console.log(data);
      setMessages((prevMessages) => [...prevMessages, ...data]);
    };
    getMessagesReceiver();
  }, [receiver]);
  return { messages, setMessages };
};
