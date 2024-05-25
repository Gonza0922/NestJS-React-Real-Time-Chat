import { useGetAllUsersAndRooms } from "../hooks/users.hooks";
import { useSocketContext } from "../contexts/SocketContext";
import { useUserContext } from "../contexts/UserContext";
import { UsersAndRooms } from "../interfaces/user.interfaces";
import { getDateAndHours } from "../functions/getDateAndHours";

function ChatsPanel() {
  const { user, setIsMembers } = useUserContext();
  const { conectedUsers, userToSend, setUserToSend, allMessages, scrollRef } = useSocketContext();
  const { usersAndRooms } = useGetAllUsersAndRooms(user.name);

  const getLastMessage = (sender: string, receiver: string) => {
    if (!allMessages) return [undefined, undefined, undefined];
    const lastMessage = allMessages
      .slice()
      .reverse()
      .find((message: any) =>
        message.receiver === null
          ? // room
            message.receiverName === receiver
          : // user
            (message.sender.name === sender && message.receiverName === receiver) ||
            (message.sender.name === receiver && message.receiverName === sender)
      );
    const { content, sender: resultSender, createdAt: resultCreatedAt } = lastMessage;
    return [content, resultSender, resultCreatedAt];
  };

  return (
    <div className="chats" ref={scrollRef}>
      {usersAndRooms.map((receiver: UsersAndRooms, index: number) => {
        const [lastMessageContent, lastMessageSender, lastMessageCreatedAt] = getLastMessage(
          user.name,
          receiver.name
        );
        return (
          <div
            key={index}
            className={`sender-chat ${userToSend === receiver.name ? "selected" : ""}`}
            onClick={() => {
              setIsMembers({ name: receiver.name, members: receiver.members });
              setUserToSend(receiver.name);
            }}
          >
            <div className="container-image-and-online">
              <div className={conectedUsers.includes(receiver.name) ? "online" : "offline"}></div>
              <img className="user-image" src={receiver.image} alt="user-image" />
            </div>
            <div className="container-user-chat-content">
              <span className="sender-chat-span">{receiver.name}</span>
              <p className="sender-content">
                {lastMessageSender.name === user.name ? "Me" : lastMessageSender.name}:{" "}
                {lastMessageContent &&
                  (lastMessageContent.length < 25
                    ? lastMessageContent
                    : `${lastMessageContent.substring(0, 25)}...`)}
              </p>
              <span className="last-message-hour">{getDateAndHours(lastMessageCreatedAt)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ChatsPanel;
