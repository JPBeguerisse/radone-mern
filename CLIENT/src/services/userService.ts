// import { api } from "@/api/api";
import { User } from "src/types/user.types";
import { api } from "../api/api";

export const getUsers = async (): Promise<User[]> => {
  const response = await api.get("/user");
  return response.data;
};

export const getUser = async (id: string): Promise<User> => {
  const response = await api.get(`/user/${id}`);
  return response.data;
};
