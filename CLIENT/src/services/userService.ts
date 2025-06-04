// import { api } from "@/api/api";
import { UpdateUserPayload, User, UserLogin } from "src/types/user.types";
import { api } from "../api/api";

export interface FollowingResponse {
  following: User[];
  total: number;
}

export interface FollowersResponse {
  followers: User[];
  total: number;
}

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

// Rechercher des utilisateurs par nom d'utilisateur
export const searchUsers = async (searchTerm: string): Promise<User[]> => {
  const response = await api.get(`/user/search?query=${searchTerm}`);
  return response.data;
};

//Récupérer un utilisateur par son ID (user connecté)
export const getUser = async (id: string): Promise<User> => {
  const response = await api.get(`/user/${id}`);
  return response.data;
};

//Modifier un utilisateur
export const updateUser = async (
  id: string,
  data: UpdateUserPayload
): Promise<User> => {
  const response = await api.patch(`/user/${id}`, data);
  return response.data;
};

//Modifier la photo de profil
export const updatePicture = async (formData: FormData): Promise<User> => {
  const response = await api.post("/user/upload-profil", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

//Supprimer la photo de profil
export const removePicture = async (userId: string): Promise<User> => {
  const response = await api.delete(`/user/remove-profil-picture/${userId}`);
  return response.data;
};

//Suivre un utilisateur
export const followUser = async (
  userId: string,
  userIdToFollow: string
): Promise<User> => {
  const response = await api.patch(`/user/follow/${userId}`, {
    userIdToFollow,
  });
  return response.data;
};

//Ne plus suivre un utilisateur
export const unFollowUser = async (
  userId: string,
  userIdToUnfollow: string
): Promise<User> => {
  const response = await api.patch(`/user/unfollow/${userId}`, {
    userIdToUnfollow,
  });
  return response.data;
};

//Récupérer les followers d'un utilisateur
export const getFollowers = async (
  userId: string,
  page: number = 1,
  limit: number = 5,
  search?: string
): Promise<FollowersResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (search) {
    params.append("search", search);
  }
  const response = await api.get<FollowersResponse>(
    `/user/${userId}/followers?${params}`
  );
  console.log("Followers: ", response.data);
  return response.data;
};

//Récupérer les utilisateurs suivis par un utilisateur
export const getFollowing = async (
  userId: string,
  page: number = 1,
  limit: number = 5,
  search?: string
): Promise<FollowingResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (search) {
    params.append("search", search);
  }

  const response = await api.get<FollowingResponse>(
    `/user/${userId}/following?${params}`
  );
  console.log("Following: ", response.data);
  return response.data;
};

//Récupérer les followers d'un utilisateur
// export const getFollowers = async (userId: string): Promise<User[]> => {
//   const response = await api.get(`/user/${userId}/followers/`);
//   return response.data;
// };

//Récupérer les utilisateurs suivis par un utilisateur
// export const getFollowing = async (userId: string): Promise<User[]> => {
//   const response = await api.get(`/user/${userId}/following`);
//   return response.data;
// };
