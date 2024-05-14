import axios from "./axios.ts";

export const getImageRequest = async (user_ID: number) => {
  const request = await axios.get(`/images/get/${user_ID}`);
  return request.data;
};

export const putImageRequest = async (user_ID: number, file: File) => {
  const request = await axios.put(`/images/put/${user_ID}`, file, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return request.data;
};

export const deleteImageRequest = async (user_ID: number) => {
  const request = await axios.delete(`/images/delete/${user_ID}`);
  return request.data;
};
