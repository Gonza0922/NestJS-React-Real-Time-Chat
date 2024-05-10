import { useState, useEffect, FormEvent, useRef } from "react";
import { useUserContext } from "../contexts/UserContext.tsx";
import { Message } from "../interfaces/message.interfaces.ts";
import { useGetAllUsers } from "../hooks/users.hooks.ts";
import { RegisterData } from "../interfaces/user.interfaces.ts";
import { getDateAndHours } from "../functions/getDateAndHours.ts";
import { useSocketContext } from "../contexts/SocketContext.tsx";

function Chat() {
  const { user, logout } = useUserContext();
  const { conectedUsers, socket, userToSend, setUserToSend, messages, setMessages, dateISO } =
    useSocketContext();
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
      setMessages([...messages, { sender: user.name, content: text, createdAt: dateISO }]);
      setText("");
    }
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
          {users.map((user: RegisterData, index: number) => (
            <div
              key={index}
              className={`sender-chat ${userToSend === user.name ? "selected" : ""}`}
              onClick={() => setUserToSend(user.name)}
            >
              <span className="sender-chat-span">{user.name}</span>
              <div className={conectedUsers.includes(user.name) ? "online" : "offline"}></div>
            </div>
          ))}
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
