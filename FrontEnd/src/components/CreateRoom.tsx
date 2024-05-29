import { FormEvent, useState } from "react";
import { useSocketContext } from "../contexts/SocketContext.tsx";
import { useUserContext } from "../contexts/UserContext.tsx";
import { RegisterData } from "../interfaces/user.interfaces.ts";
import { useGetAllUsers } from "../hooks/users.hooks.ts";
import { putRoomImageRequest } from "../api/images.api.ts";

function CreateRoom() {
  const roomDefaultImage =
    "https://res.cloudinary.com/dz5q0a2nd/image/upload/v1716411818/group-default-profile_f8ynlj.jpg";
  const { user, setError, error } = useUserContext();
  const { setPanel, scrollRef, socket } = useSocketContext();
  const { users } = useGetAllUsers(user.name);
  const [room, setRoom] = useState<any>({
    name: "",
    creator: user.user_ID,
    url: roomDefaultImage,
    image: roomDefaultImage,
  });
  const [members, setMembers] = useState<number[]>([]);

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
    if (members.includes(userId)) setMembers(members.filter((member) => member !== userId));
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
    <form className="create-room" ref={scrollRef} onSubmit={roomHandleSubmit}>
      <div className="container-h2-span-input-button-h3">
        <h3 className="h3-create-room">Create Room</h3>
        <div className="container-errors">
          {error.length > 0 ? <div className="room-error">{error}</div> : <div></div>}
        </div>
        <div className="input-room-image-and-text-button">
          <div className="input-and-room-image">
            <input type="file" onChange={(e) => handleImageChange(e)} />
            <img src={room.url} alt="room Image" className="room-image" />
          </div>
          <div className="text-and-button">
            <input
              className="input-room-name"
              id="input"
              value={room.name}
              placeholder="Room name"
              type="text"
              onChange={(e) => setRoom({ ...room, name: e.target.value })}
              autoFocus
              spellCheck
              autoComplete="off"
            />
            <button type="submit" className="button-create-room">
              Create
            </button>
          </div>
        </div>
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
  );
}

export default CreateRoom;
