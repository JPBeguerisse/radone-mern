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

export type ForgotPasswordResponse = {
  message: string;
};

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
  const response = await api.put(`/user/${id}`, data);
  return response.data;
};

//Modifier la photo de profil avec multer
// export const updatePicture = async (formData: FormData): Promise<User> => {
//   const response = await api.post("/user/upload-profil", formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });
//   return response.data;
// };

//Modifier la photo de profil avec un cloudinary
export const updatePicture = async (
  userId: string,
  url: string,
  public_id?: string
): Promise<User> => {
  const res = await api.put(`/user/update/profil-picture`, {
    userId: userId,
    pictureUrl: url,
    publicId: public_id,
  });
  return res.data;
};

//Supprimer la photo de profil avec un cloudinary
export const deleteProfilePicture = async (userId: string): Promise<User> => {
  const response = await api.put(`/user/delete-profil-picture/${userId}`);
  return response.data;
};

//Supprimer la photo de profil avec multer non utilisée
export const removePicture = async (userId: string): Promise<User> => {
  const response = await api.delete(`/user/remove-profil-picture/${userId}`);
  return response.data;
};

//Suivre un utilisateur
export const followUser = async (
  userId: string,
  userIdToFollow: string
): Promise<User> => {
  const response = await api.put(`/user/follow/${userId}`, {
    userIdToFollow,
  });
  return response.data;
};

//Ne plus suivre un utilisateur
export const unFollowUser = async (
  userId: string,
  userIdToUnfollow: string
): Promise<User> => {
  const response = await api.put(`/user/unfollow/${userId}`, {
    userIdToUnfollow,
  });
  return response.data;
};

//Récupérer les followers d'un utilisateur
export const getFollowers = async (
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
    `/user/followers?${params}`
  );
  console.log("Followers: ", response.data);
  return response.data;
};

//Récupérer les utilisateurs suivis par un utilisateur
export const getFollowing = async (
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
    `/user/following?${params}`
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

// Récupérer les followers d'un profil pour la page de profil
export const getProfileFollowers = async (userId: string): Promise<User[]> => {
  const response = await api.get(`/user/${userId}/followers`);
  return response.data;
};

// Récupérer les following d'un profil pour la page de profil
export const getProfileFollowing = async (userId: string): Promise<User[]> => {
  const response = await api.get(`/user/${userId}/following`);
  return response.data;
};

// Supprimer le compte utilisateur
export const deleteAccount = async (): Promise<string> => {
  return await api.delete(`/user`);
};

// Mot de de passe oublié
export const forgotPassword = async (
  email: string
): Promise<ForgotPasswordResponse> => {
  const response = await api.post("/user/forgot-password", { email });
  return response.data;
};

// Réinitialiser le mot de passe
export const resetPassword = async (
  token: string,
  newPassword: string
): Promise<ForgotPasswordResponse> => {
  const response = await api.post(`/user/reset-password/${token}`, {
    newPassword,
  });
  return response.data;
};
