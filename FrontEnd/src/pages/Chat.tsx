import { useState, useEffect, FormEvent, useRef } from "react";
import { useUserContext } from "../contexts/UserContext.tsx";
import { Message } from "../interfaces/message.interfaces.ts";
import { useGetAllUsers } from "../hooks/users.hooks.ts";
import { RegisterData } from "../interfaces/user.interfaces.ts";
import { getDateAndHours } from "../functions/getDateAndHours.ts";
import { useSocketContext } from "../contexts/SocketContext.tsx";
import { useForm } from "react-hook-form";

function Chat() {
  const { user, logout, error } = useUserContext();
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
  const [panel, setPanel] = useState("chats");
  const [updateName, setUpdateName] = useState(user.name);
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>();

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

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

  const handleUpdateProfile = handleSubmit((data) => {
    console.log(data);
  });

  return (
    <>
      <nav className="navbar">
        <h1>Real Time Chat</h1>
        <button className="button-logout" onClick={logout}>
          Logout
        </button>
      </nav>
      <div className="chats-panel">
        <nav className="chats-navbar">
          <span onClick={() => setPanel("chats")} className="span-chats">
            Chats
          </span>
          <img
            onClick={() => setPanel("image")}
            className="profile-image-mini"
            src={user.image}
            alt="profile Image"
          />
        </nav>
        {panel === "chats" ? (
          <div className="chats" ref={scrollRef}>
            {users.map((receiver: RegisterData, index: number) => {
              const [lastMessageContent, lastMessageSender, lastMessageCreatedAt] =
                getLastMessage(user.name, receiver.name);
              return (
                <div
                  key={index}
                  className={`sender-chat ${userToSend === receiver.name ? "selected" : ""}`}
                  onClick={() => setUserToSend(receiver.name)}
                >
                  <div className="container-image-and-online">
                    <div
                      className={conectedUsers.includes(receiver.name) ? "online" : "offline"}
                    ></div>
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
                    <span className="last-message-hour">
                      {getDateAndHours(lastMessageCreatedAt)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="update-profile">
            {/* <div className="container-profile-image">
              <img
                className="profile-image"
                src={user.image}
                alt="profile Image"
                onClick={() => console.log("Click")}
              />
              <button className="button-profile-image"></button>
            </div> */}
            <div className="container-input-and-profile-image">
              <div className="input-and-profile-image">
                <input type="file" />
                <img
                  src={user.image}
                  alt="profile Image"
                  className="profile-image"
                  onClick={() => console.log("Click")}
                />
              </div>
            </div>
            <form onSubmit={handleUpdateProfile}>
              <div className="container-errors">
                {error === "User not found" ? (
                  <div className="error">{error}</div>
                ) : error === "Incorrect Password" ? (
                  <div className="error">{error}</div>
                ) : (
                  <div></div>
                )}
              </div>
              <div className="row-input">
                <div className="input-field">
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    type="text"
                    value={updateName}
                    className="validate"
                    autoComplete="off"
                    spellCheck={false}
                    {...register("name", {
                      required: { value: true, message: "File is required" },
                      onChange: (e) => {
                        setUpdateName(e.target.value);
                      },
                    })}
                  />
                  <div className="container-span">
                    {errors.name && <span>{errors.name.message}</span>}
                  </div>
                </div>
              </div>
              <div className="row-input">
                <div className="container-button-login-register">
                  <button type="submit" id="reserve" className="button-login-register">
                    Update Profile
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
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
