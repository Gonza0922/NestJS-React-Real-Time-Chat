import { useGetAllUsersAndRooms } from "../hooks/users.hooks";
import { useSocketContext } from "../contexts/SocketContext";
import { useUserContext } from "../contexts/UserContext";
import { UsersAndRooms } from "../interfaces/user.interfaces";
import { getDateAndHours } from "../functions/getDateAndHours";
import { Message } from "../interfaces/message.interfaces";

function ChatsPanel() {
  const { user, setIsMembers } = useUserContext();
  const { conectedUsers, userToSend, setUserToSend, allMessages, scrollRef } = useSocketContext();
  const { usersAndRooms } = useGetAllUsersAndRooms(user.name);

  const getLastMessage = (sender: string, receiverName: string) => {
    if (!allMessages) return [undefined, undefined, undefined];
    const lastMessage = allMessages
      .slice()
      .reverse()
      .find((message: Message) =>
        message.type === "room"
          ? // room
            message.receiverName === receiverName
          : // user
            (message.sender.name === sender && message.receiverName === receiverName) ||
            (message.sender.name === receiverName && message.receiverName === sender)
      );
    if (!lastMessage)
      return [{ sender: { name: undefined }, content: undefined, createdAt: undefined }];
    const { content, sender: resultSender, createdAt: resultCreatedAt } = lastMessage;
    return [content, resultSender, resultCreatedAt];
  };

  return (
    <div className="chats" ref={scrollRef}>
      {usersAndRooms.map((userOrRoom: UsersAndRooms, index: number) => {
        const [lastMessageContent, lastMessageSender, lastMessageCreatedAt] = getLastMessage(
          user.name,
          userOrRoom.name
        );
        if (userOrRoom.members) console.log(userOrRoom);
        return (
          <div
            key={index}
            className={`sender-chat ${userToSend === userOrRoom.name ? "selected" : ""}`}
            onClick={() => {
              setIsMembers({ name: userOrRoom.name, members: userOrRoom.members });
              setUserToSend(userOrRoom.name);
            }}
          >
            <div className="container-image-and-online">
              <div
                className={conectedUsers.includes(userOrRoom.name) ? "online" : "offline"}
              ></div>
              <img className="user-image" src={userOrRoom.image} alt="user-image" />
            </div>
            {lastMessageSender ? (
              <div className="container-user-chat-content">
                <span className="sender-chat-span">{userOrRoom.name}</span>
                <p className="sender-content">
                  {lastMessageSender.name === user.name ? "Me" : lastMessageSender.name}:{" "}
                  {lastMessageContent &&
                    (lastMessageContent.length <= 32
                      ? lastMessageContent
                      : `${lastMessageContent.substring(0, 32)}...`)}
                </p>
                <span className="last-message-hour">{getDateAndHours(lastMessageCreatedAt)}</span>
              </div>
            ) : (
              <>
                {Array.isArray(userOrRoom.members) ? (
                  <div className="container-user-chat-content">
                    <span className="sender-chat-span">{userOrRoom.name}</span>
                    <p className="sender-content">New Room.</p>
                    <span className="last-message-hour">
                      {getDateAndHours(userOrRoom.createdAt)}
                    </span>
                  </div>
                ) : (
                  <div className="container-user-chat-none-content">
                    <span className="sender-chat-span">{userOrRoom.name}</span>
                    <p className="sender-none-content"></p>
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ChatsPanel;
