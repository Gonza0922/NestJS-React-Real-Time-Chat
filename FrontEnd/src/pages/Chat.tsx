import { useEffect } from "react";
import { useUserContext } from "../contexts/UserContext.tsx";
import { useSocketContext } from "../contexts/SocketContext.tsx";
import ChatsPanel from "../components/ChatsPanel.tsx";
import MessagesContainer from "../components/MessagesContainer.tsx";
import UpdateImagePanel from "../components/UpdateImagePanel.tsx";
import CreateRoom from "../components/CreateRoom.tsx";

function Chat() {
  const { user, logout, updateProfile, setUpdateProfile } = useUserContext();
  const { userToSend, messages, panel, setPanel, scrollRef } = useSocketContext();

  useEffect(() => {
    setUpdateProfile({
      name: user.name,
      image: user.image,
      url: user.image,
    });
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

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
          <span
            onClick={() => {
              if (updateProfile.image !== null)
                setUpdateProfile({ ...updateProfile, url: user.image, image: user.image });
              setPanel("chats");
            }}
            className="span-chats"
          >
            Chats
          </span>
          <img
            onClick={() => setPanel("image")}
            className="profile-image-mini"
            src={updateProfile.url}
            alt="profile Image"
          />
          <img
            onClick={() => setPanel("rooms")}
            className="rooms-image-mini"
            src={import.meta.env.VITE_ROOM_NONE_IMAGE}
            alt="rooms Image"
          />
        </nav>
        {panel === "chats" ? (
          <ChatsPanel />
        ) : panel === "rooms" ? (
          <CreateRoom />
        ) : (
          <UpdateImagePanel />
        )}
      </div>
      {userToSend !== "none" ? (
        <MessagesContainer />
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
