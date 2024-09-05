import axios from "./axios.ts";

export const getImageRequest = async (user_ID: number) => {
  const request = await axios.get(`/images/get/${user_ID}`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  return request.data;
};

export const putImageRequest = async (user_ID: number, file: File) => {
  const formData = new FormData();
  formData.append("image", file);
  const request = await axios.put(`/images/put/${user_ID}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  return request.data;
}; //[USED]

export const putRoomImageRequest = async (roomName: string, file: File) => {
  const formData = new FormData();
  formData.append("image", file);
  const request = await axios.put(`/images/room/put/${roomName}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  return request.data;
}; //[USED]

export const deleteImageRequest = async (user_ID: number) => {
  const request = await axios.delete(`/images/delete/${user_ID}`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  return request.data;
}; //[USED]
