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

//Récupérer un utilisateur par son username pour l'afficher dans le profil
export const getUserByUsername = async (username: string): Promise<User> => {
  const response = await api.get(`/user/by-username/${username}`);
  return response.data;
};

//Récupérer un utilisateur par son ID (user connecté)
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
  const response = await api.post("/user/upload-profil", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const removePicture = async (userId: string): Promise<User> => {
  const response = await api.delete(`/user/remove-profil-picture/${userId}`);
  return response.data;
};

export const followUser = async (
  userId: string,
  userIdToFollow: string
): Promise<User> => {
  const response = await api.patch(`/user/follow/${userId}`, {
    userIdToFollow,
  });
  return response.data;
};

export const unFollowUser = async (
  userId: string,
  userIdToUnfollow: string
): Promise<User> => {
  const response = await api.patch(`/user/unfollow/${userId}`, {
    userIdToUnfollow,
  });
  return response.data;
};
