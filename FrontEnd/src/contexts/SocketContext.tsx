import { useState, useEffect, createContext, useContext } from "react";
import { ChildrenType } from "../interfaces/user.interfaces";
import { Socket, io } from "socket.io-client";
import { useUserContext } from "./UserContext";
import { Message } from "../interfaces/message.interfaces";
import { useGetAllMessages } from "../hooks/messages.hooks";

const socketContext = createContext<any>(undefined);

export function useSocketContext() {
  return useContext(socketContext);
}

const SocketProvider = (props: ChildrenType) => {
  const token = sessionStorage.getItem("token");
  const { user, isAuthenticated } = useUserContext();
  const [conectedUsers, setConectedUsers] = useState<string[]>([]);
  const [socket, setSocket] = useState<Socket>();
  const [userToSend, setUserToSend] = useState("none");
  const { messages, setMessages } = useGetAllMessages(userToSend, token);
  const dateISO = new Date().toISOString();

  useEffect(() => {
    const socket = io("http://localhost:3000", {
      auth: { userName: user.user_ID, receiver: userToSend },
    });
    setSocket(socket);
  }, [userToSend, isAuthenticated]);

  useEffect(() => {
    if (socket) {
      socket.on("getOnlineUsers", async (names: string[]) => {
        setConectedUsers(names);
      });
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (socket) {
      socket.on("message", (data: Message) => {
        data = { ...data, createdAt: dateISO };
        setMessages((state: Message[]) => [...state, data]);
      });
      return () => {
        socket.close();
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
      }}
    >
      {props.children}
    </socketContext.Provider>
  );
};

export default SocketProvider;
