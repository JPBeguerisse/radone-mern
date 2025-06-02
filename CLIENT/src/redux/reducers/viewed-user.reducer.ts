import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Post } from "src/types/post.types";
import { User, UserState } from "src/types/user.types";

const initialState: UserState = {
  user: null,
  error: null,
  posts: null,
};

const viewedUserSlice = createSlice({
  name: "viewedUser",
  initialState,
  reducers: {
    // 🟡 Chargement de l'utilisateur by username
    getUserByUsernameRequested: (state, action: PayloadAction<string>) => {
      console.log("Get user by username lancé", action.payload);
    },
    getUserByUsernameSuccess: (state, action: PayloadAction<User>) => {
      // Cette action est déclenchée lorsqu'un utilisateur est récupéré avec succès.
      state.user = action.payload; // On met à jour `user` avec les données récupérées.
    },
    getUserByUsernameFailed: (state, action: PayloadAction<string>) => {
      // Cette action est déclenchée lorsqu'il y a une erreur lors de la récupération de l'utilisateur.
      state.error = action.payload; // On met à jour `error` avec le message d'erreur.
    },

    getPostsByUserRequested: (state, action: PayloadAction<string>) => {
      state.loading = true;
      console.log("Récupération des posts d'un user lancé:", action.payload);
    },
    getPostsByUserSuccess: (state, action: PayloadAction<Post[]>) => {
      state.loading = false;
      state.posts = action.payload;
    },
    getPostsByUserFailed: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  getUserByUsernameRequested,
  getUserByUsernameSuccess,
  getUserByUsernameFailed,
  getPostsByUserRequested,
  getPostsByUserSuccess,
  getPostsByUserFailed,
} = viewedUserSlice.actions;

export const viewedUserReducer = viewedUserSlice.reducer;
