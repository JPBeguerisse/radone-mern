// user.reducer.ts
import { User, UserState } from "../../types/user.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Post } from "src/types/post.types";

const initialState: UserState = {
  user: null,
  error: null,
  savedPosts: null,
  posts: null,
  loading: false,
  isDeletingPicture: false,
  isUpdatingPicture: false,
};

const userSlice = createSlice({
  name: "User",
  initialState,
  reducers: {
    // 🔵 --- RÉCUPÉRATION UTILISATEUR ---
    getUserRequested: (state, action: PayloadAction<string>) => {},
    getUserSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.error = null;
    },
    getUserFailed: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },

    // 🟡 --- MISE À JOUR UTILISATEUR ---
    updateUserRequested: (
      state,
      action: PayloadAction<{ id: string; data: Partial<User> }>
    ) => {
      state.error = null;
      state.loading = true;
    },
    updateUserSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.error = null;
      state.loading = false;
    },
    updateUserFailed: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },

    // 🟣 --- PHOTO DE PROFIL (Cloudinary) ---
    updateProfilePictureRequested: (
      state,
      action: PayloadAction<{
        userId: string;
        pictureUrl: string;
        public_id: string;
      }>
    ) => {
      state.error = null;
      state.isUpdatingPicture = true;
    },
    updateProfilePictureSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.error = null;
      state.isUpdatingPicture = false;
    },
    updateProfilePictureFailed: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isUpdatingPicture = false;
    },

    removeProfilePictureRequested: (state, action: PayloadAction<string>) => {
      state.error = null;
      state.isDeletingPicture = true;
    },
    removeProfilePictureSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.error = null;
      state.isDeletingPicture = false;
    },
    removeProfilePictureFailed: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isDeletingPicture = false;
    },

    // 🔘 --- PHOTO DE PROFIL (multipart) ---
    updatePictureRequested: (state, action: PayloadAction<FormData>) => {},
    updatePictureSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    updatePictureFailed: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },

    removePictureRequested: (state, action: PayloadAction<string>) => {
      state.error = null;
      state.loading = true;
    },
    removePictureSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.error = null;
      state.loading = false;
    },
    removePictureFailed: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },

    // 🧡 --- FOLLOW / UNFOLLOW ---
    followUserRequested: (
      state,
      action: PayloadAction<{ userId: string; userIdToFollow: string }>
    ) => {},
    followUserSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    followUserFailed: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },

    unfollowUserRequested: (
      state,
      action: PayloadAction<{ userId: string; userIdToUnfollow: string }>
    ) => {},
    unfollowUserSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    unfollowUserFailed: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },

    // 🟢 --- POSTS UTILISATEUR ---
    getPostsUserRequested: (state, action: PayloadAction<string>) => {
      state.error = null;
    },
    getPostsUserSuccess: (state, action: PayloadAction<Post[]>) => {
      state.posts = action.payload;
    },
    getPostsUserFailed: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },

    // 🟢 --- POSTS ENREGISTRÉS ---
    getPostsSavedRequested: (state, action: PayloadAction<string>) => {
      state.error = null;
    },
    getPostsSavedSuccess: (state, action: PayloadAction<Post[]>) => {
      state.savedPosts = action.payload;
    },
    getPostsSavedFailed: (state, action: PayloadAction<string>) => {
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
  updatePictureFailed,
  updatePictureRequested,
  updatePictureSuccess,
  removePictureFailed,
  removePictureRequested,
  removePictureSuccess,
  followUserRequested,
  followUserSuccess,
  followUserFailed,
  unfollowUserRequested,
  unfollowUserSuccess,
  unfollowUserFailed,
  getPostsSavedRequested,
  getPostsSavedSuccess,
  getPostsSavedFailed,
  getPostsUserRequested,
  getPostsUserSuccess,
  getPostsUserFailed,
  updateProfilePictureRequested,
  updateProfilePictureSuccess,
  updateProfilePictureFailed,
  removeProfilePictureRequested,
  removeProfilePictureSuccess,
  removeProfilePictureFailed,
} = userSlice.actions;

export const userReducer = userSlice.reducer;
