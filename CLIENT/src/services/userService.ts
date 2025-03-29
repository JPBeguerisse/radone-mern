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
