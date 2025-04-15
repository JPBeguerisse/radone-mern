import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { create } from "domain";
import { User, UserState } from "src/types/user.types";

const initialState: UserState = {
  user: null,
  error: null,
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
      state.error = null; // On réinitialise `error` car il n'y a pas d'erreur.
    },
    getUserByUsernameFailed: (state, action: PayloadAction<string>) => {
      // Cette action est déclenchée lorsqu'il y a une erreur lors de la récupération de l'utilisateur.
      state.error = action.payload; // On met à jour `error` avec le message d'erreur.
    },
  },
});

export const {
  getUserByUsernameRequested,
  getUserByUsernameSuccess,
  getUserByUsernameFailed,
} = viewedUserSlice.actions;

export const viewedUserReducer = viewedUserSlice.reducer;
