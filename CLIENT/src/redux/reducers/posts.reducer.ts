import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Post, PostsState } from "../../types/post.types";

const initialState: PostsState = {
  allPosts: [],
  followingPosts: [],
  forYouPosts: [],
  post: null,
  error: null,
  hasMoreForYou: true,
  hasMoreFollowingPosts: true,
};

const postsSlice = createSlice({
  name: "Posts",
  initialState,
  reducers: {
    /** ------------------------- RÉCUPÉRATION DE POSTS -------------------------- */

    // Récupération de tous les posts
    getPostsRequested: (
      state,
      action: PayloadAction<{ skip: number; limit: number }>
    ) => {},
    getPostsSuccess: (state, action: PayloadAction<Post[]>) => {
      state.allPosts = [...state.allPosts, ...action.payload];
      state.error = null;
    },
    getPostsFailed: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },

    // Récupération d'un seul post
    getPostRequested: (state, action: PayloadAction<string>) => {},
    getPostSuccess: (state, action: PayloadAction<Post>) => {
      state.post = action.payload;
    },
    getPostFailed: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },

    // Récupération des posts des comptes suivis
    getPostsByFollowingRequested: (
      state,
      action: PayloadAction<{ userId: string; skip: number; limit: number }>
    ) => {},
    getPostsByFollowingSuccess: (state, action) => {
      const { hasMore, followingPosts, skip } = action.payload;
      const existingIds = new Set(state.followingPosts.map((p) => p._id));
      const newPosts = followingPosts.filter(
        (post: Post) => !existingIds.has(post._id)
      );

      state.followingPosts =
        skip === 0 ? followingPosts : [...state.followingPosts, ...newPosts];
      state.error = null;
      state.hasMoreFollowingPosts = hasMore;
    },
    getPostsByFollowingFailed: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },

    // Récupération des posts "Pour vous"
    getPostsForYouRequested: (
      state,
      action: PayloadAction<{ userId: string; skip: number; limit: number }>
    ) => {},
    getPostsForYouSuccess: (state, action) => {
      const { forYouPosts, hasMore } = action.payload;
      const existingIds = new Set(state.forYouPosts.map((p) => p._id));
      const newPosts = forYouPosts.filter((p: Post) => !existingIds.has(p._id));
      state.forYouPosts = [...state.forYouPosts, ...newPosts];
      state.hasMoreForYou = hasMore;
    },
    getPostsForYouFailed: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },

    /** ------------------------- MODIFICATION DE POST -------------------------- */

    updatePostRequested: (
      state,
      action: PayloadAction<{ _id: string; data: Partial<Post> }>
    ) => {},
    updatePostSuccess: (state, action: PayloadAction<Post>) => {
      state.allPosts = state.allPosts.map((post) =>
        post._id === action.payload._id ? action.payload : post
      );
    },
    updatePostFailed: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },

    /** ------------------------- SUPPRESSION DE POST -------------------------- */

    deletePostRequested: (
      state,
      action: PayloadAction<{ postId: string; userId: string }>
    ) => {},
    deletePostSuccess: (state, action: PayloadAction<string>) => {
      state.allPosts = state.allPosts.filter(
        (post) => post._id !== action.payload
      );
    },
    deletePostFailed: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },

    /** ------------------------- CRÉATION DE POST -------------------------- */

    createPostRequested: (
      state,
      action: PayloadAction<{
        pictureUrl: string;
        publicId: string;
        message: string;
        posterId: string;
      }>
    ) => {},
    createPostSuccess: (state, action: PayloadAction<any>) => {
      state.allPosts = [action.payload, ...state.allPosts].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    },
    createPostFailed: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },

    /** ------------------------- COMMENTAIRES -------------------------- */

    createCommentRequested: (
      state,
      action: PayloadAction<{ _id: string; commenterId: string; text: string }>
    ) => {},
    createCommentSuccess: (state, action: PayloadAction<Post>) => {
      state.allPosts = state.allPosts.map((post) =>
        post._id === action.payload._id ? action.payload : post
      );
    },
    createCommentFailed: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },

    deleteCommentRequested: (
      state,
      action: PayloadAction<{ postId: string; commentId: string }>
    ) => {},
    deleteCommentSuccess: (
      state,
      action: PayloadAction<{ postId: string; commentId: string }>
    ) => {
      state.allPosts = state.allPosts.map((post) =>
        post._id === action.payload.postId
          ? {
              ...post,
              comments: post.comments?.filter(
                (comment) => comment._id !== action.payload.commentId
              ),
            }
          : post
      );
    },
    deleteCommentFailed: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },

    /** ------------------------- LIKE / UNLIKE POST -------------------------- */

    likePostRequested: (state, action: PayloadAction<{ postId: string }>) => {},
    likePostSuccess: (state, action: PayloadAction<Post>) => {
      state.allPosts = state.allPosts.map((post) =>
        post._id === action.payload._id ? action.payload : post
      );
      state.followingPosts = state.followingPosts.map((post) =>
        post._id === action.payload._id ? action.payload : post
      );
      state.forYouPosts = state.forYouPosts.map((post) =>
        post._id === action.payload._id ? action.payload : post
      );
    },
    likePostFailed: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },

    unLikePostRequested: (
      state,
      action: PayloadAction<{ postId: string }>
    ) => {},
    unLikePostSuccess: (state, action: PayloadAction<Post>) => {
      state.allPosts = state.allPosts.map((post) =>
        post._id === action.payload._id ? action.payload : post
      );
      state.followingPosts = state.followingPosts.map((post) =>
        post._id === action.payload._id ? action.payload : post
      );
      state.forYouPosts = state.forYouPosts.map((post) =>
        post._id === action.payload._id ? action.payload : post
      );
    },
    unLikePostFailed: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },

    /** ------------------------- LIKE / UNLIKE COMMENT -------------------------- */

    likeCommentRequested: (
      state,
      action: PayloadAction<{
        postId: string;
        commentId: string;
        //userId: string;
      }>
    ) => {},
    likeCommentSuccess: (state, action: PayloadAction<Post>) => {
      state.allPosts = state.allPosts.map((post) =>
        post._id === action.payload._id ? action.payload : post
      );
    },
    likeCommentFailed: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },

    unLikeCommentRequested: (
      state,
      action: PayloadAction<{
        postId: string;
        commentId: string;
      }>
    ) => {},
    unLikeCommentSuccess: (state, action: PayloadAction<Post>) => {
      state.allPosts = state.allPosts.map((post) =>
        post._id === action.payload._id ? action.payload : post
      );
    },
    unLikeCommentFailed: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },

    /** ------------------------- SAVE / UNSAVE POST -------------------------- */

    savePostRequested: (
      state,
      action: PayloadAction<{ postId: string; userId: string }>
    ) => {},
    savePostSuccess: (state, action: PayloadAction<Post>) => {
      state.allPosts = state.allPosts.map((post) =>
        post._id === action.payload._id ? action.payload : post
      );
      state.followingPosts = state.followingPosts.map((post) =>
        post._id === action.payload._id ? action.payload : post
      );
      state.forYouPosts = state.forYouPosts.map((post) =>
        post._id === action.payload._id ? action.payload : post
      );
    },
    savePostFailed: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },

    unSavePostRequested: (
      state,
      action: PayloadAction<{ postId: string; userId: string }>
    ) => {},
    unSavePostSuccess: (state, action: PayloadAction<Post>) => {
      state.allPosts = state.allPosts.map((post) =>
        post._id === action.payload._id ? action.payload : post
      );
      state.followingPosts = state.followingPosts.map((post) =>
        post._id === action.payload._id ? action.payload : post
      );
      state.forYouPosts = state.forYouPosts.map((post) =>
        post._id === action.payload._id ? action.payload : post
      );
    },
    unSavePostFailed: (state, action: PayloadAction<string>) => {
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
  getPostFailed,
  updatePostRequested,
  updatePostSuccess,
  updatePostFailed,
  deletePostRequested,
  deletePostSuccess,
  deletePostFailed,
  createPostRequested,
  createPostSuccess,
  createPostFailed,
  createCommentRequested,
  createCommentSuccess,
  createCommentFailed,
  deleteCommentRequested,
  deleteCommentSuccess,
  deleteCommentFailed,
  likePostRequested,
  likePostSuccess,
  likePostFailed,
  unLikePostRequested,
  unLikePostSuccess,
  unLikePostFailed,
  likeCommentRequested,
  likeCommentSuccess,
  likeCommentFailed,
  unLikeCommentRequested,
  unLikeCommentSuccess,
  unLikeCommentFailed,
  savePostRequested,
  savePostSuccess,
  savePostFailed,
  unSavePostRequested,
  unSavePostSuccess,
  unSavePostFailed,
  getPostsByFollowingRequested,
  getPostsByFollowingSuccess,
  getPostsByFollowingFailed,
  getPostsForYouRequested,
  getPostsForYouSuccess,
  getPostsForYouFailed,
} = postsSlice.actions;

export const postsReducer = postsSlice.reducer;
