import { deleteImageRequest, putImageRequest } from "../api/images.api.ts";
import { useUserContext } from "../contexts/UserContext.tsx";
import { useSocketContext } from "../contexts/SocketContext.tsx";

function UpdateImagePanel() {
  const { user, error, updateProfile, setUpdateProfile } = useUserContext();
  const { setPanel } = useSocketContext();

  const handleUpdateProfile = () => {
    if (updateProfile.image !== user.image) putImageRequest(user.user_ID, updateProfile.image);
    setPanel("chats");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedImage = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2)
          setUpdateProfile({ ...updateProfile, url: reader.result, image: selectedImage });
      };
      if (selectedImage) reader.readAsDataURL(selectedImage);
    }
  };

  const handleImageDelete = () => {
    setUpdateProfile({
      ...updateProfile,
      url: import.meta.env.VITE_NONE_IMAGE,
    });
    deleteImageRequest(user.user_ID);
    setPanel("chats");
  };

  return (
    <div className="update-profile">
      <div className="container-input-and-profile-image">
        <div className="input-and-profile-image">
          <input type="file" onChange={(e) => handleImageChange(e)} />
          <img src={updateProfile.url} alt="profile Image" className="profile-image" />
        </div>
        <button onClick={handleImageDelete} className="button-delete">
          Delete
        </button>
      </div>
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
        <div className="container-button-login-register">
          <button onClick={handleUpdateProfile} id="reserve" className="button-login-register">
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateImagePanel;
