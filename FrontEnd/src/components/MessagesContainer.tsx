import { FormEvent, useState } from "react";
import { getDateAndHours } from "../functions/getDateAndHours.ts";
import { useSocketContext } from "../contexts/SocketContext.tsx";
import { useUserContext } from "../contexts/UserContext.tsx";
import { SenderStringMessage } from "../interfaces/message.interfaces.ts";
import { RegisterData } from "../interfaces/user.interfaces.ts";

function MessagesContainer() {
  const { user, isMembers } = useUserContext();
  const {
    socket,
    userToSend,
    messages,
    setMessages,
    dateISO,
    allMessages,
    setAllMessages,
    scrollRef,
    roomMembers,
  } = useSocketContext();
  const [text, setText] = useState("");

  const hasRoomMembers = roomMembers.length > 0;

  const textHandleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (text.trim()) {
      // no se envian inputs vacios
      if (socket) socket.emit("message", text);
      const completeData = {
        sender: user.name,
        content: text,
        createdAt: dateISO,
        receiverName: userToSend,
      };
      if (!isMembers.members) setMessages([...messages, completeData]);
      setAllMessages([...allMessages, { ...completeData, sender: user }]);
      setText("");
    }
  };

  return (
    <div className="container">
      {hasRoomMembers ? (
        <>
          <nav className="navbar-chat-with-members">{userToSend}</nav>
          <div className="container-members">
            {roomMembers.map((member: RegisterData, index: number) => (
              <span key={index} className="sender-content">
                {member.name}
                {roomMembers.length !== index + 1 ? ", " : null}
              </span>
            ))}
          </div>
        </>
      ) : (
        <nav className="navbar-chat">{userToSend}</nav>
      )}
      <div className="screen" ref={scrollRef}>
        {messages.map((message: SenderStringMessage, index: number) => {
          const isSender = message.sender === user.name;
          const isReceiver = message.sender === userToSend || message.receiverName === userToSend;

          if (!isSender && !isReceiver) return null;

          return (
            <div key={index} className={isSender ? "right" : "left"}>
              <span className="sender">
                {hasRoomMembers && !isSender ? message.sender : null}
                <span className="hour">{getDateAndHours(message.createdAt)}</span>
              </span>
              <p className="content">{message.content}</p>
            </div>
          );
        })}
      </div>
      <form className="chat-form" onSubmit={textHandleSubmit}>
        <input
          className="input-chat"
          placeholder="Message"
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
