import { User } from "./user.types";

export interface Post {
  _id?: string; // ID unique de la publication
  posterId?: string; // ID de l'utilisateur qui a créé la publication
  message?: string; // Le message de la publication
  picture?: string; // Lien vers une image (optionnel)
  likers?: string[]; // Liste des ID des utilisateurs qui ont aimé la publication
  comments?: Comment[]; // Liste des commentaires sur la publication
  createdAt?: string; // Date de création de la publication
  updatedAt?: string; // Date de la dernière mise à jour de la publication
}

// Interface pour un commentaire
interface Comment {
  commenterId: string; // ID de l'utilisateur qui a commenté
  text: string; // Le texte du commentaire
  timestamp: string; // La date et l'heure du commentaire
}

export interface PostsState {
  posts: Post[] | null;
  post: Post | null;
  error: string | null;
}

export interface PostModalViewProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
  message?: string;
  setEditedMessage?: (message: string) => void;
  isEditing?: boolean;
  setIsEditing?: (edit: boolean) => void;
  onSave?: () => void;
  onDelete?: (id: string) => void;
  currentUser?: User;
}

export interface PostModalCreateProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  currentUser: User;
}
