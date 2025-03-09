// import { api } from "@/api/api";
import { api } from "../api/api";

import { User } from "@/redux/types/user.types";

export const getUsers = async (): Promise<User[]> => {
  const response = await api.get("/user");
  return response.data;
};

export const getUser = async (id: string): Promise<User> => {
  const response = await api.get(`/user/${id}`);
  return response.data;
};
