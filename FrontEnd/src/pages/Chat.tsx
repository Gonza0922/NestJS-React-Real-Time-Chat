import { useState, useEffect, FormEvent, useRef } from "react";
import { useUserContext } from "../contexts/UserContext.tsx";
import { Message } from "../interfaces/message.interfaces.ts";
import { useGetAllUsers } from "../hooks/users.hooks.ts";
import { RegisterData } from "../interfaces/user.interfaces.ts";
import { getDateAndHours } from "../functions/getDateAndHours.ts";
import { useSocketContext } from "../contexts/SocketContext.tsx";

function Chat() {
  const { user, logout } = useUserContext();
  const {
    conectedUsers,
    socket,
    userToSend,
    setUserToSend,
    messages,
    setMessages,
    dateISO,
    allMessages,
    setAllMessages,
  } = useSocketContext();
  const { users } = useGetAllUsers(user.name);
  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (text.trim()) {
      // no se envian inputs vacios
      if (socket) socket.emit("message", text);
      const completeData = {
        sender: user.name,
        content: text,
        createdAt: dateISO,
        receiver: userToSend,
      };
      setMessages([...messages, completeData]);
      setAllMessages([...allMessages, completeData]);
      setText("");
    }
  };

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
    <>
      <nav className="navbar">
        <h1>Real Time Chat</h1>
        <button className="button-logout" onClick={logout}>
          Logout
        </button>
      </nav>
      <div className="chats-panel">
        <nav className="chats-navbar">Chats</nav>
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
                <span className="sender-chat-span">{receiver.name}</span>
                <div
                  className={conectedUsers.includes(receiver.name) ? "online" : "offline"}
                ></div>
                <p className="sender">
                  {lastMessageSender === user.name ? "Me" : receiver.name}:{" "}
                  {lastMessageContent &&
                    (lastMessageContent.length < 25
                      ? lastMessageContent
                      : `${lastMessageContent.substring(0, 25)}...`)}
                </p>
                <span className="last-message-hour">{getDateAndHours(lastMessageCreatedAt)}</span>
              </div>
            );
          })}
        </div>
      </div>
      {userToSend !== "none" ? (
        <div className="container">
          <nav className="navbar-chat">{userToSend}</nav>
          <div className="screen" ref={scrollRef}>
            {messages.map((message: Message, index: number) =>
              message.sender === user.name ? (
                <div key={index} className="right">
                  <span className="sender">
                    {message.sender}
                    <span className="hour">{getDateAndHours(message.createdAt)}</span>
                  </span>
                  <p className="content">{message.content}</p>
                </div>
              ) : message.sender === userToSend ? (
                <div key={index} className="left">
                  <span className="sender">
                    {message.sender}
                    <span className="hour">{getDateAndHours(message.createdAt)}</span>
                  </span>
                  <p className="content">{message.content}</p>
                </div>
              ) : (
                ""
              )
            )}
          </div>
          <form className="chat-form" onSubmit={handleSubmit}>
            <input
              className="input-chat"
              id="input"
              value={text}
              type="text"
              onChange={(e) => setText(e.target.value)}
              autoFocus
              spellCheck
              autoComplete="off"
            />
            <button className="button-chat">Send</button>
          </form>
        </div>
      ) : (
        <div className="container-none">
          <div>
            <h2>Welcome {user.name}</h2>
            <h2>Select a chat to start messaging</h2>
          </div>
        </div>
      )}
    </>
  );
}

export default Chat;
