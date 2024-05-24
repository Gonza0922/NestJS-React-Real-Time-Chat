import { useState, useEffect, createContext, useContext, useRef } from "react";
import { ChildrenType } from "../interfaces/user.interfaces";
import { Socket, io } from "socket.io-client";
import { useUserContext } from "./UserContext";
import { Message } from "../interfaces/message.interfaces";
import { useGetAllMessages } from "../hooks/messages.hooks";
import { getAllMessagesRequest } from "../api/messages.api";

const socketContext = createContext<any>(undefined);

export function useSocketContext() {
  return useContext(socketContext);
}

const SocketProvider = (props: ChildrenType) => {
  const { user, isAuthenticated, isMembers } = useUserContext();
  const token = sessionStorage.getItem("token");
  const [userToSend, setUserToSend] = useState("none");
  const { messages, setMessages } = useGetAllMessages(isMembers, token);
  const [conectedUsers, setConectedUsers] = useState<string[]>([]);
  const [socket, setSocket] = useState<Socket>();
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [panel, setPanel] = useState("chats");
  const scrollRef = useRef<HTMLDivElement>(null);
  const dateISO = new Date().toISOString();

  useEffect(() => {
    const getMessagesReceiver = async () => {
      const data = await getAllMessagesRequest();
      setAllMessages(data);
    };
    getMessagesReceiver();
  }, []);

  useEffect(() => {
    const socket = io("http://localhost:3000", {
      auth: { userName: user.user_ID, receiver: userToSend },
    });
    setSocket(socket);
  }, [userToSend, isAuthenticated]);

  useEffect(() => {
    if (socket) {
      const allMessagesHandler = (data: Message) => {
        data = { ...data, createdAt: dateISO, receiver: user.name };
        setAllMessages((prevMessages) => [...prevMessages, data]);
      };
      socket.on("message", allMessagesHandler);
      return () => {
        socket.off("message", allMessagesHandler);
      };
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on("getOnlineUsers", (names: string[]) => setConectedUsers(names));
      return () => {
        socket.off("getOnlineUsers", (names: string[]) => setConectedUsers(names));
      };
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (socket) {
      const messagesHandler = (data: Message) => {
        data = { ...data, createdAt: dateISO, receiver: userToSend };
        setMessages((state: Message[]) => [...state, data]);
      };
      socket.on("message", messagesHandler);
      return () => {
        socket.off("message", messagesHandler);
      };
    }
  }, [userToSend]);

  return (
    <socketContext.Provider
      value={{
        conectedUsers,
        socket,
        userToSend,
        setUserToSend,
        messages,
        setMessages,
        dateISO,
        allMessages,
        setAllMessages,
        panel,
        setPanel,
        scrollRef,
      }}
    >
      {props.children}
    </socketContext.Provider>
  );
};

export default SocketProvider;
