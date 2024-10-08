import { useState, useEffect, createContext, useContext, useRef } from "react";
import { ChildrenType, RegisterData, UsersAndRooms } from "../interfaces/user.interfaces";
import { Socket, io } from "socket.io-client";
import { useUserContext } from "./UserContext";
import { Message } from "../interfaces/message.interfaces";
import { useGetAllMessages } from "../hooks/messages.hooks";
import { getAllMessagesRequest } from "../api/messages.api";
import { getRoomByNameRequest } from "../api/room.api";
import { getUserIdRequest } from "../api/users.api";

const socketContext = createContext<any>(undefined);

export function useSocketContext() {
  return useContext(socketContext);
}

const SocketProvider = (props: ChildrenType) => {
  const { user, isAuthenticated, isMembers } = useUserContext();
  const [userToSend, setUserToSend] = useState("none");
  const { messages, setMessages } = useGetAllMessages(isMembers);
  const [conectedUsers, setConectedUsers] = useState<string[]>([]);
  const [socket, setSocket] = useState<Socket>();
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [panel, setPanel] = useState("chats");
  const scrollRef = useRef<HTMLDivElement>(null);
  const dateISO = new Date().toISOString();
  const [roomMembers, setRoomMembers] = useState<RegisterData[]>([]);
  const [room, setRoom] = useState({ name: "" });
  const [usersAndRooms, setUsersAndRooms] = useState<RegisterData[]>([]);

  useEffect(() => {
    const getMessagesReceiver = async () => {
      const data = await getRoomByNameRequest(userToSend);
      setRoomMembers([]);
      if (data.length > 0) {
        data[0].members.forEach(async (member_ID: number) => {
          const dataMember = await getUserIdRequest(member_ID);
          if (dataMember.name === user.name) {
            setRoomMembers((prevState) => [...prevState, { ...dataMember, name: "Me" }]);
          } else setRoomMembers((prevState) => [...prevState, dataMember]);
        });
      }
    };
    getMessagesReceiver();
  }, [isMembers]);

  useEffect(() => {
    const getMessagesReceiver = async () => {
      const data = await getAllMessagesRequest();
      setAllMessages(data);
    };
    getMessagesReceiver();
  }, []);

  useEffect(() => {
    const socket = io("http://localhost:3000", {
      auth: { userName: user.user_ID, receiverName: userToSend },
    });
    setSocket(socket);
    return () => {
      socket.disconnect();
    };
  }, [userToSend, isAuthenticated]);

  useEffect(() => {
    if (socket) {
      const allMessagesHandler = (data: any) => {
        const finalData = { ...data, createdAt: dateISO };
        setAllMessages((prevAllMessages) => [...prevAllMessages, finalData]);
        if (finalData.type === "room") {
          if (finalData.receiverName === userToSend)
            setMessages((prevMessages) => [
              ...prevMessages,
              { ...finalData, sender: finalData.sender.name },
            ]);
        } else {
          setMessages((prevMessages) => [
            ...prevMessages,
            { ...finalData, sender: finalData.sender.name },
          ]);
        }
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
  }, [socket]);

  useEffect(() => {
    if (socket) {
      const addClientToRoomHandler = (data: UsersAndRooms) => {
        console.log({ ...data, createdAt: dateISO });
        const finalData = { ...data, createdAt: dateISO };
        setUsersAndRooms((prevState) => [...prevState, finalData]);
      };
      socket.on("addClientToRoom", addClientToRoomHandler);
      return () => {
        socket.off("addClientToRoom", addClientToRoomHandler);
      };
    }
  }, [socket]);

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
        roomMembers,
        room,
        setRoom,
        usersAndRooms,
        setUsersAndRooms,
        setRoomMembers,
      }}
    >
      {props.children}
    </socketContext.Provider>
  );
};

export default SocketProvider;
