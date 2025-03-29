//user.reducer.ts
import { User, UserState } from "../../types/user.types";
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

    // 🟡 Chargement de la mise à jour
    updateUserRequested: (
      state,
      action: PayloadAction<{ id: string; data: Partial<User> }>
    ) => {
      console.log("Mis a jour lancé", action.payload);
      state.error = null; // ✅ Vider les erreurs avant la requête
      /*Tu re-soumets avec la même erreur 
      → Le PayloadAction contient la même string 
      → Redux voit que la valeur ne change pas 
      → state ne change pas 
      → aucune mise à jour de React */
    },

    // 🟢 Succès de la mise à jour
    updateUserSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },

    // 🔴 Échec de la mise à jour
    updateUserFailed: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const {
  getUserRequested,
  getUserSuccess,
  getUserFailed,
  updateUserFailed,
  updateUserSuccess,
  updateUserRequested,
} = userSlice.actions;
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
