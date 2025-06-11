// Composant Redux pour gérer les utilisateurs suivis (following) non utilisé dans ce projet mais plutôt react-query
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FollowingState, FollowingUser } from "src/types/followers.types";

// État initial pour la liste des utilisateurs suivis
const initialState: FollowingState = {
  following: [], // Liste des utilisateurs suivis
  error: null, // Message d'erreur éventuel
  loading: false, // Indicateur de chargement
  hasMore: true, // Indique s’il reste encore des données à charger
  page: 1, // Page courante pour la pagination
  search: "", // Terme de recherche
};

// Création du slice pour gérer les utilisateurs suivis (following)
const followingSlice = createSlice({
  name: "Following",
  initialState,
  reducers: {
    // Déclenchement de la récupération des following
    getFollowingRequested: (
      state,
      action: PayloadAction<{
        userId: string;
        page: number;
        limit: number;
        search: string;
      }>
    ) => {
      state.loading = true;
      state.error = null;
    },

    // Succès de la récupération : fusionner les nouveaux following avec ceux existants
    getFollowingSuccess: (
      state,
      action: PayloadAction<{ following: FollowingUser[]; hasMore: boolean }>
    ) => {
      const { following, hasMore } = action.payload;

      // Éviter les doublons avec un Set
      const existingIds = new Set(state.following.map((f) => f._id));
      const newFollowing = following.filter((f) => !existingIds.has(f._id));

      state.loading = false;
      state.following = [...state.following, ...newFollowing];
      state.hasMore = hasMore;
    },

    // Échec de la récupération
    getFollowingFailed: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Réinitialisation de l’état du slice (utile pour un nouveau profil par ex.)
    resetFollowing: (state) => {
      state.following = [];
      state.error = null;
      state.loading = false;
      state.hasMore = true;
      state.page = 1; // On remet à 1 pour correspondre à la logique React Query
      state.search = "";
    },
  },
});

// Export des actions et du reducer
export const {
  getFollowingRequested,
  getFollowingSuccess,
  getFollowingFailed,
  resetFollowing,
} = followingSlice.actions;

export const followingReducer = followingSlice.reducer;
