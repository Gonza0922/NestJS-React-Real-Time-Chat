import { FormEvent, useState } from "react";
import { Message } from "../interfaces/message.interfaces.ts";
import { getDateAndHours } from "../functions/getDateAndHours.ts";
import { useSocketContext } from "../contexts/SocketContext.tsx";
import { useUserContext } from "../contexts/UserContext.tsx";

function MessagesContainer() {
  const { user } = useUserContext();
  const {
    socket,
    userToSend,
    messages,
    setMessages,
    dateISO,
    allMessages,
    setAllMessages,
    scrollRef,
  } = useSocketContext();
  const [text, setText] = useState("");

  const textHandleSubmit = (e: FormEvent<HTMLFormElement>) => {
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

  return (
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
      <form className="chat-form" onSubmit={textHandleSubmit}>
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

export default MessagesContainer;