// import { api } from "@/api/api";
import { UpdateUserPayload, User, UserLogin } from "src/types/user.types";
import { api } from "../api/api";

export const createUser = async (data: User): Promise<User> => {
  const response = await api.post("/user/register", data);
  return response.data;
};

export const loginUser = async (data: UserLogin) => {
  const response = await api.post("/user/login", data);
  return response.data;
};

export const getUsers = async (): Promise<User[]> => {
  const response = await api.get("/user");
  return response.data;
};

export const getUser = async (id: string): Promise<User> => {
  const response = await api.get(`/user/${id}`);
  return response.data;
};

export const updateUser = async (
  id: string,
  data: UpdateUserPayload
): Promise<User> => {
  const response = await api.patch(`/user/${id}`, data);
  return response.data;
};

export const updatePicture = async (formData: FormData): Promise<User> => {
  console.log(
    "Données envoyées à l'API :",
    Object.fromEntries(formData.entries())
  );
  const response = await api.post("/user/upload-profil", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  console.log("Réponse de l'API :", response);

  return response.data;
};

export const removePicture = async (userId: string): Promise<User> => {
  const response = await api.delete(`/user/remove-profil-picture/${userId}`);
  return response.data;
};
