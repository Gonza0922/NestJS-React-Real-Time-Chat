import { useState, useEffect, FormEvent } from "react";
import io from "socket.io-client";
import { getAllMessagesRequest } from "../api/messages.api.ts";

const socket = io("http://localhost:3000");

interface message {
  person: string;
  content: string;
}

function Chat() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<message[]>([]);

  useEffect(() => {
    const getAllMessages = async () => {
      const data = await getAllMessagesRequest();
      console.log(data);
      setMessages([...messages, ...data]);
    };
    getAllMessages();
  }, []);

  useEffect(() => {
    socket.on("message", (data: message) => {
      setMessages((state: message[]) => [...state, data]);
    });
    return () => {
      socket.off("message");
    };
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (text.trim()) {
      // no se envian inputs vacios
      socket.emit("message", text);
      setMessages([...messages, { person: "Me", content: text }]);
      setText("");
    }
  };

  return (
    <div className="container">
      <nav className="navbar">Real Time Chat</nav>
      <div className="screen">
        {messages.map((message: message, index: number) =>
          message.person === "Me" ? (
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
      <form onSubmit={handleSubmit}>
        <input
          id="input"
          value={text}
          type="text"
          onChange={(e) => setText(e.target.value)}
          autoFocus
          spellCheck
          autoComplete="off"
        />
        <button>Send</button>
      </form>
    </div>
  );
}

export default Chat;
