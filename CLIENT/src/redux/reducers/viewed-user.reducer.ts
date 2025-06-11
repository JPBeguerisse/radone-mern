import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Post } from "src/types/post.types";
import { User, UserState } from "src/types/user.types";

// État initial du slice `viewedUser`
const initialState: UserState = {
  user: null,
  error: null,
  posts: null,
};

// Slice Redux pour gérer l'utilisateur consulté (via son userName) et ses publications
const viewedUserSlice = createSlice({
  name: "viewedUser",
  initialState,
  reducers: {
    //  Récupération de l'utilisateur via son `userName`
    getUserByUsernameRequested: (state, action: PayloadAction<string>) => {
      // Aucune mutation ici : déclenche simplement l'effet de récupération
    },

    //  Succès de la récupération de l'utilisateur
    getUserByUsernameSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.error = null;
    },

    //  Échec de la récupération
    getUserByUsernameFailed: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },

    //  Récupération des posts d'un utilisateur
    getPostsByUserRequested: (state, action: PayloadAction<string>) => {
      state.loading = true;
    },

    //  Succès récupération des posts
    getPostsByUserSuccess: (state, action: PayloadAction<Post[]>) => {
      state.loading = false;
      state.posts = action.payload;
      state.error = null;
    },

    //  Échec récupération des posts
    getPostsByUserFailed: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

//  Export des actions
export const {
  getUserByUsernameRequested,
  getUserByUsernameSuccess,
  getUserByUsernameFailed,
  getPostsByUserRequested,
  getPostsByUserSuccess,
  getPostsByUserFailed,
} = viewedUserSlice.actions;

//  Export du reducer
export const viewedUserReducer = viewedUserSlice.reducer;
