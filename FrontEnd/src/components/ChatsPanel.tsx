import { useGetAllUsers } from "../hooks/users.hooks";
import { useSocketContext } from "../contexts/SocketContext";
import { useUserContext } from "../contexts/UserContext";
import { Message } from "../interfaces/message.interfaces";
import { RegisterData } from "../interfaces/user.interfaces";
import { getDateAndHours } from "../functions/getDateAndHours";

function ChatsPanel() {
  const { user } = useUserContext();
  const { conectedUsers, userToSend, setUserToSend, allMessages, scrollRef } = useSocketContext();
  const { users } = useGetAllUsers(user.name);

  const getLastMessage = (sender: string, receiver: string) => {
    if (!allMessages) return [undefined, undefined, undefined];
    const lastMessage = allMessages
      .slice()
      .reverse()
      .find(
        (message: Message) =>
          (message.sender === sender && message.receiver === receiver) ||
          (message.sender === receiver && message.receiver === sender)
      );
    const { content, sender: resultSender, createdAt: resultCreatedAt } = lastMessage;
    return [content, resultSender, resultCreatedAt];
  };

  return (
    <div className="chats" ref={scrollRef}>
      {users.map((receiver: RegisterData, index: number) => {
        const [lastMessageContent, lastMessageSender, lastMessageCreatedAt] = getLastMessage(
          user.name,
          receiver.name
        );
        return (
          <div
            key={index}
            className={`sender-chat ${userToSend === receiver.name ? "selected" : ""}`}
            onClick={() => setUserToSend(receiver.name)}
          >
            <div className="container-image-and-online">
              <div className={conectedUsers.includes(receiver.name) ? "online" : "offline"}></div>
              <img className="user-image" src={receiver.image} alt="user-image" />
            </div>
            <div className="container-user-chat-content">
              <span className="sender-chat-span">{receiver.name}</span>
              <p className="sender-content">
                {lastMessageSender === user.name ? "Me" : receiver.name}:{" "}
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
