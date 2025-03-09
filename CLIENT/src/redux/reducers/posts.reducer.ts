import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Post, PostsState } from "../types/post.types";
import { act } from "react";
import { updatePost } from "@/services/postService";

const initialState: PostsState = {
  posts: null,
  post: null,
  error: null,
};

const postsSlice = createSlice({
  name: "Posts",
  initialState,
  reducers: {
    getPostsRequested: (state) => {},
    getPostsSuccess: (state, action: PayloadAction<Post[]>) => {
      state.posts = action.payload;
      state.error = null;
    },
    getPostsFailed: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },

    /**Récupérer un post depuis le reducer */
    getPostRequested: (state, action: PayloadAction<string>) => {
      console.log("Récupération du post demandée :", action.payload);
    },
    getPostSuccess: (state, action: PayloadAction<Post>) => {
      state.post = action.payload;
      // console.log("Récupération du post demandée :", action.payload);
    },
    getPostFailed: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },

    /** ✅ Ajouter l'action `updatePostSuccess` */
    updatePostRequested: (
      state,
      action: PayloadAction<{ _id: string; data: Partial<Post> }>
    ) => {
      console.log("updatePostRequested dispatched", action.payload);
    },
    updatePostSuccess: (state, action: PayloadAction<Post>) => {
      if (state.posts) {
        state.posts = state.posts.map((post) =>
          post._id === action.payload._id ? action.payload : post
        );
      }
    },
    updatePostFailed: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },

    // Action pour demander la suppression d'un post
    deletePostRequested: (state, action: PayloadAction<string>) => {
      console.log("Suppression en cour...", action.payload);
    },

    // Action en cas de succès de la suppression
    deletePostSuccess: (state, action: PayloadAction<string>) => {
      //state;
      state.posts =
        state.posts &&
        state.posts.filter((post) => post._id !== action.payload);
    },

    // Action en cas d'échec
    deletePostFailed: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },

    createPostRequested: (
      state,
      action: PayloadAction<{
        message: string;
        posterId: string;
        postImage?: File;
      }>
    ) => {
      console.log("Creation du post lancé", action.payload);
    },
    createPostSuccess: (state, action: PayloadAction<any>) => {
      state.posts?.push(action.payload);
    },

    createPostFailed: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const {
  getPostsRequested,
  getPostsSuccess,
  getPostsFailed,
  getPostRequested,
  getPostSuccess,
  updatePostRequested,
  updatePostSuccess,
  updatePostFailed,
  deletePostRequested,
  deletePostSuccess,
  deletePostFailed,
  createPostFailed,
  createPostRequested,
  createPostSuccess,
} = postsSlice.actions;
export const postsReducer = postsSlice.reducer;

// export default function postsReducer(state = initialState, action: PostsActions) {
//     switch(action.type){
//         case "GET_POSTS_REQUESTED":
//             return{
//                 ...state,
//             };

//         case "GET_POSTS_SUCCESS":
//             return{
//                 ...state,
//                 posts: action.payload
//             };

//         case "GET_POSTS_FAILED":
//             return {
//                 ...state,
//                 error: action.message
//             };

//         default:
//             return state
//     }
// }
