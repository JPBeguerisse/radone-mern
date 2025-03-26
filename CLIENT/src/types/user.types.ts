export interface User {
    [x: string]: any;
    _id: string;         // L'identifiant unique de l'utilisateur
    firstName: string;    // Le prénom de l'utilisateur
    lastName: string;     // Le nom de l'utilisateur
    email: string;        // L'email de l'utilisateur
    password?: string;    // Le mot de passe (peut être optionnel si non requis)
    picture?: string;     // Le chemin de l'image de profil (facultatif)
    likes?: string[];     // Liste des IDs des posts aimés par l'utilisateur
    createdAt: Date;      // Date de création de l'utilisateur
    updatedAt: Date;      // Date de mise à jour de l'utilisateur
  }
  


export interface UserState {
  user: User | null;
  error: string | null;
}


export interface UsersState {
  users: User[] | null;
  error: string | null;
}