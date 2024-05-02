import { useState, useEffect, FormEvent, useRef } from "react";
import io, { Socket } from "socket.io-client";
import { useUserContext } from "../contexts/UserContext.tsx";
import { Message } from "../interfaces/message.interfaces.ts";
import { useGetAllMessages } from "../hooks/messages.hooks.ts";
import { useGetAllUsers } from "../hooks/users.hooks.ts";

function Chat() {
  const { user, logout } = useUserContext();
  const { users } = useGetAllUsers(user.name);
  const [userToSend, setUserToSend] = useState<string>("none");
  const { messages, setMessages } = useGetAllMessages(
    userToSend,
    sessionStorage.getItem("token")
  );
  const [text, setText] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current !== null) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    const socket = io("http://localhost:3000", {
      auth: { userName: user.name, receiver: userToSend },
    });
    setSocket(socket);
    if (socket !== null) {
      socket.on("message", (data: Message) => {
        setMessages((state: Message[]) => [...state, data]);
      });
      return () => {
        socket.close();
      };
    }
  }, [userToSend]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (text.trim()) {
      // no se envian inputs vacios
      if (socket !== null) socket.emit("message", text);
      setMessages([...messages, { sender: user.name, content: text }]);
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
          {users.map((user: any, index: number) => (
            <div
              key={index}
              className={`sender-chat ${userToSend === user.name ? "selected" : ""}`}
              onClick={() => setUserToSend(user.name)}
            >
              <span className="sender-chat-span">{user.name}</span>
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
                  <span className="sender">{message.sender}</span>
                  <p className="content">{message.content}</p>
                </div>
              ) : (
                <div key={index} className="left">
                  <span className="sender">{message.sender}</span>
                  <p className="content">{message.content}</p>
                </div>
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
