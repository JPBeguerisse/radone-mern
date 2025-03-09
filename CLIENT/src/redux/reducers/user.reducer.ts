//user.reducer.ts
import { User, UserState } from "../types/user.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: UserState = {
  user: null,
  error: null,
};

const userSlice = createSlice({
  name: "User", // Nom du slice, utilisé pour générer des types d'action uniques.
  initialState, // L'état initial défini ci-dessus.
  reducers: {
    // Les reducers définissent comment l'état évolue en réponse aux actions.
    // Cette action est appelée lorsqu'une requête pour obtenir un utilisateur est déclenchée.
    // Aucun changement dans l'état pour l'instant.
    getUserRequested: (state) => state,
    getUserSuccess: (state, action: PayloadAction<User>) => {
      // Cette action est déclenchée lorsqu'un utilisateur est récupéré avec succès.
      state.user = action.payload; // On met à jour `user` avec les données récupérées.
      state.error = null; // On réinitialise `error` car il n'y a pas d'erreur.
    },
    getUserFailed: (state, action: PayloadAction<string>) => {
      // Cette action est déclenchée lorsqu'il y a une erreur lors de la récupération de l'utilisateur.
      state.error = action.payload; // On met à jour `error` avec le message d'erreur.
    },
  },
});

export const { getUserRequested, getUserSuccess, getUserFailed } =
  userSlice.actions;
export const userReducer = userSlice.reducer;

// export default function userReducer(state = initialState, action: UserActions){
//     switch(action.type) {
//         case "GET_USER_REQUESTED":
//             return{
//                 ...state
//             }

//         case "GET_USER_SUCCESS":
//             return {
//                 ...state,
//                 user: action.payload
//             }

//         case "GET_USER_FAILED":
//             return {
//                 ...state,
//                 error: action.message
//             }

//         default:
//             return state;
//     }
// }
