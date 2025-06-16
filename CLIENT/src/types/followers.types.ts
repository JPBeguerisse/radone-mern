export type FollowerUser = {
  _id: string; // L'identifiant unique du follower
  name: string; // Le nom du follower
  userName: string; // Le nom d'utilisateur du follower
  picture?: string; // L'URL de la photo de profil du follower (facultatif)
};

export type FollowingUser = {
  _id: string; // L'identifiant unique du follower
  name: string; // Le nom du follower
  userName: string; // Le nom d'utilisateur du follower
  picture?: string; // L'URL de la photo de profil du follower (facultatif)
};

export interface FollowersState {
  followers: FollowerUser[]; // Liste des followers
  error: string | null; // Message d'erreur éventuel
  loading?: boolean; // Indicateur de chargement
  hasMore: boolean; // Indique s'il y a plus de followers à charger
  page: number;
  search: string; // Chaîne de recherche pour filtrer les followers
}

export interface FollowingState {
  following: FollowingUser[]; // Liste des utilisateurs suivis
  error: string | null; // Message d'erreur éventuel
  loading?: boolean; // Indicateur de chargement
  hasMore: boolean; // Indique s'il y a plus d'utilisateurs à charger
  page: number;
  search: string; // Chaîne de recherche pour filtrer les utilisateurs suivis
}

export type followerResponse = {
  followers: FollowerUser[];
  total: number;
  hasMore: boolean;
};

export type followingResponse = {
  following: FollowingUser[];
  total: number;
  hasMore: boolean;
};
