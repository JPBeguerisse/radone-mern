export interface User {
  [x: string]: any;
  _id?: string; // L'identifiant unique de l'utilisateur
  name: string; // Le prénom de l'utilisateur
  userName: string; // Le nom de l'utilisateur
  email: string; // L'email de l'utilisateur
  password?: string; // Le mot de passe (peut être optionnel si non requis)
  bio?: string;
  profilePicture?: string; // Le chemin de l'image de profil (facultatif)
  likes?: string[]; // Liste des IDs des posts aimés par l'utilisateur
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
