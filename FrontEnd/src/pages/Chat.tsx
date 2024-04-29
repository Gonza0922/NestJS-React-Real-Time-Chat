import { useState, useEffect, FormEvent, useRef } from "react";
import io, { Socket } from "socket.io-client";
import { useUserContext } from "../contexts/UserContext.tsx";
import { Message } from "../interfaces/message.interfaces.ts";
import { useGetAllMessages } from "../hooks/messages.hooks.ts";

function Chat() {
  const { user } = useUserContext();
  const { messages, setMessages } = useGetAllMessages();
  const [text, setText] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const scrollRef = useRef<any>(null);

  useEffect(() => {
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    const socket = io("http://localhost:3000", {
      auth: { userName: user.name },
    });
    setSocket(socket);
    socket.on("message", (data: Message) => {
      setMessages((state: Message[]) => [...state, data]);
    });
    return () => {
      socket.close();
    };
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (text.trim()) {
      // no se envian inputs vacios
      if (socket !== null) socket.emit("message", text);
      setMessages([...messages, { person: user.name, content: text }]);
      setText("");
    }
  };

  return (
    <div className="container">
      <nav className="navbar">Real Time Chat</nav>
      <div className="screen" ref={scrollRef}>
        {messages.map((message: Message, index: number) =>
          message.person === user.name ? (
            <div key={index} className="right">
              <span className="person">{message.person}</span>
              <p className="content">{message.content}</p>
            </div>
          ) : (
            <div key={index} className="left">
              <span className="person">{message.person}</span>
              <p className="content">{message.content}</p>
            </div>
          )
        )}
      </div>
      <div className="space"></div>
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
  );
}

export default Chat;
