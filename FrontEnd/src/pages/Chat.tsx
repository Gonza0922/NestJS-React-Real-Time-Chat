import { FormEvent, useEffect, useState } from "react";
import { useUserContext } from "../contexts/UserContext.tsx";
import { useSocketContext } from "../contexts/SocketContext.tsx";
import ChatsPanel from "../components/ChatsPanel.tsx";
import UpdateImagePanel from "../components/UpdateImagePanel.tsx";
import MessagesContainer from "../components/MessagesContainer.tsx";
import { useGetAllUsers } from "../hooks/users.hooks.ts";
import { RegisterData } from "../interfaces/user.interfaces.ts";
import { putRoomImageRequest } from "../api/images.api.ts";

function Chat() {
  const roomDefaultImage =
    "https://res.cloudinary.com/dz5q0a2nd/image/upload/v1716411818/group-default-profile_f8ynlj.jpg";
  const { user, logout, updateProfile, setUpdateProfile, setError, error } = useUserContext();
  const { userToSend, messages, panel, setPanel, scrollRef, socket } = useSocketContext();
  const { users } = useGetAllUsers(user.name);
  const [room, setRoom] = useState<any>({
    name: "",
    creator: user.user_ID,
    url: roomDefaultImage,
    image: roomDefaultImage,
  });
  const [members, setMembers] = useState<number[]>([]);

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

  const roomHandleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (room.name === "") return setError("Required Room Name");
    if (members.length > 0) {
      setError({});
      // guardar imagen creada de cloudinary en la db
      socket.emit("createRoom", room);
      socket.emit("addClientToRoom", { ...room, members });
      console.log(room);
      if (room.image !== room.url) putRoomImageRequest(room.name, room.image);
    } else return setError("You have to select any user to create a room");
    setMembers([]);
    setRoom({
      ...room,
      name: "",
      creator: user.user_ID,
      url: roomDefaultImage,
      image: roomDefaultImage,
    });
    setPanel("chats");
  };

  const handleMembers = (userId: number) => {
    if (!members.includes(userId)) setMembers([...members, userId]);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedImage = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2)
          setRoom({ ...room, url: reader.result, image: selectedImage });
      };
      if (selectedImage) reader.readAsDataURL(selectedImage);
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
        <nav className="chats-navbar">
          <span
            onClick={() => {
              setUpdateProfile({ ...updateProfile, url: user.image, image: user.image });
              setPanel("chats");
            }}
            className="span-chats"
          >
            Chats
          </span>
          <span className="button-set-rooms" onClick={() => setPanel("Rooms")}>
            Rooms
          </span>
          <img
            onClick={() => setPanel("image")}
            className="profile-image-mini"
            src={updateProfile.url}
            alt="profile Image"
          />
        </nav>
        {panel === "chats" ? (
          <ChatsPanel />
        ) : panel === "Rooms" ? (
          <form className="create-room" ref={scrollRef} onSubmit={roomHandleSubmit}>
            <div className="container-h2-span-input-button-h3">
              <div className="container-input-and-profile-image">
                <div className="input-and-profile-image">
                  <input type="file" onChange={(e) => handleImageChange(e)} />
                  <img src={room.url} alt="profile Image" className="profile-image" />
                </div>
              </div>
              <h3>Create Room</h3>
              <div className="container-errors">
                {error.length > 0 ? <div className="room-error">{error}</div> : <div></div>}
              </div>
              <span className="span-create-room">Room Name</span>
              <input
                className="input-room-name"
                id="input"
                value={room.name}
                type="text"
                onChange={(e) => setRoom({ ...room, name: e.target.value })}
                autoFocus
                spellCheck
                autoComplete="off"
              />
              <button type="submit" className="button-create-room">
                Create Room
              </button>
              <h3 className="select-users">Select users:</h3>
            </div>
            {users.map((user: RegisterData, index: number) => (
              <div
                key={index}
                className={`sender-chat ${members.includes(user.user_ID) ? "selected" : ""}`}
                onClick={() => handleMembers(user.user_ID)}
              >
                <div className="container-image-and-online">
                  <img className="user-image" src={user.image} alt="user-image" />
                </div>
                <span className="sender-chat-span">{user.name}</span>
              </div>
            ))}
          </form>
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
