import { Post } from "./post.types";

export interface User {
  [x: string]: any;
  _id?: string; // L'identifiant unique de l'utilisateur
  name: string; // Le prénom de l'utilisateur
  userName: string; // Le nom de l'utilisateur
  email: string; // L'email de l'utilisateur
  password?: string; // Le mot de passe (peut être optionnel si non requis)
  bio?: string;
  picture?: string; // Le chemin de l'image de profil (facultatif)
  likes?: string[]; // Liste des IDs des posts aimés par l'utilisateur
  followers?: string[]; // Liste des IDs des utilisateurs qui suivent cet utilisateur
  following?: string[]; // Liste des IDs des utilisateurs suivis par cet utilisateur
  createdAt?: Date; // Date de création de l'utilisateur
  updatedAt?: Date; // Date de mise à jour de l'utilisateur
}

export type UserLogin = {
  email: string;
  password: string;
};

export interface UserState {
  user: User | null;
  error: string | null;
  posts?: Post[] | null; // Liste des posts de l'utilisateur
  savedPosts?: Post[] | null; // Liste des posts sauvegardés par l'utilisateur
  loading?: boolean; // Indicateur de chargement
}

export interface UsersState {
  users: User[] | null;
  error: string | null;
}

export type UpdateUserPayload = {
  name?: string;
  userName?: string;
  email?: string;
  bio?: string;
  oldPassword?: string;
  newPassword?: string;
};

export interface ProfilProps {
  userId?: string;
}
