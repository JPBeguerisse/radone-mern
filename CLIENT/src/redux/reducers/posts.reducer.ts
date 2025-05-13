import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Post, PostsState } from "../../types/post.types";

const initialState: PostsState = {
  posts: [],
  post: null,
  error: null,
};

const postsSlice = createSlice({
  name: "Posts",
  initialState,
  reducers: {
    // getPostsRequested: (state) => {},

    // getPostsSuccess: (state, action: PayloadAction<Post[]>) => {
    //   state.posts = action.payload;
    //   state.error = null;
    // },
    // getPostsFailed: (state, action: PayloadAction<string>) => {
    //   state.error = action.payload;
    // },
    getPostsRequested: (
      state,
      action: PayloadAction<{ skip: number; limit: number }>
    ) => {
      console.log("Récupération des posts demandée :", action.payload);
    },

    getPostsSuccess: (state, action: PayloadAction<Post[]>) => {
      state.posts = [...state.posts, ...action.payload];
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
    deletePostRequested: (
      state,
      action: PayloadAction<{ postId: string; userId: string }>
    ) => {
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
      }>
    ) => {
      console.log("Creation du post lancé", action.payload);
    },

    createPostSuccess: (state, action: PayloadAction<any>) => {
      // state.posts?.push(action.payload);
      state.posts = [action.payload, ...state.posts].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    },

    createPostFailed: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },

    //REDUCER POUR AJOUTER UN COMMENTAIRE À UN POST
    createCommentRequested: (
      state,
      action: PayloadAction<{
        _id: string;
        commenterId: string;
        text: string;
      }>
    ) => {
      console.log("Creation du commentaire lancé", action.payload);
    },

    createCommentSuccess: (state, action: PayloadAction<Post>) => {
      if (state.posts) {
        state.posts = state.posts?.map((post) =>
          post._id === action.payload._id ? action.payload : post
        );
      }
    },

    createCommentFailed: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },

    //REDUCER POUR SUPPRIMER UN COMMENTAIRE
    deleteCommentRequested: (
      state,
      action: PayloadAction<{ postId: string; commentId: string }>
    ) => {
      console.log("Suppression du commentaire en cours...", action.payload);
    },

    deleteCommentSuccess: (
      state,
      action: PayloadAction<{ postId: string; commentId: string }>
    ) => {
      state.posts =
        state.posts &&
        state?.posts.map((post) => {
          if (post._id === action.payload.postId) {
            return {
              ...post,
              comments: post.comments?.filter(
                (comment) => comment._id !== action.payload.commentId
              ),
            };
          }
          return post;
        });
    },

    deleteCommentFailed: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      console.log("Suppression du commentaire échoué...", action.payload);
    },

    //Action pour liker un post
    likePostRequested: (
      state,
      action: PayloadAction<{ postId: string; userId: string }>
    ) => {
      console.log("Like en cours...", action.payload);
    },

    //action.paylod est un objet de type Post qui contient les données du post liké retournées par l'API
    //On va donc mettre à jour le post liké dans le tableau des posts
    //On va chercher le post liké dans le tableau des posts et le remplacer par le post liké
    //On va donc utiliser la méthode map pour parcourir le tableau des posts
    //On va comparer l'id du post liké avec l'id du post dans le tableau des posts
    //Si les deux id sont égaux, on remplace le post dans le tableau des posts par le post liké qui contient les données mises à jour
    //On retourne le post tel quel si les id ne correspondent pas
    //On retourne le tableau des posts mis à jour
    likePostSuccess: (state, action: PayloadAction<Post>) => {
      if (state.posts) {
        state.posts = state.posts.map((post) =>
          post._id === action.payload._id ? action.payload : post
        );
      }
    },

    likePostFailed: (state, action: PayloadAction<string>) => {
      console.log("Like échoué...", action.payload);
      state.error = action.payload;
    },

    //Action pour disliker un post
    unLikePostRequested: (
      state,
      action: PayloadAction<{ postId: string; userId: string }>
    ) => {
      console.log("Dislike en cours...", action.payload);
    },

    unLikePostSuccess: (state, action: PayloadAction<Post>) => {
      if (state.posts) {
        state.posts = state.posts.map((post) =>
          post._id === action.payload._id ? action.payload : post
        );
      }
    },

    unLikePostFailed: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      console.log("Dislike échoué...", action.payload);
    },

    //Action pour liker un commentaire
    likeCommentRequested: (
      state,
      action: PayloadAction<{
        postId: string;
        commentId: string;
        userId: string;
      }>
    ) => {
      console.log("Like commentaire en cours...", action.payload);
    },

    likeCommentSuccess: (state, action: PayloadAction<Post>) => {
      if (state.posts) {
        state.posts = state.posts.map((post) =>
          post._id === action.payload._id ? action.payload : post
        );
      }
    },

    likeCommentFailed: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      console.log("like comment échoué...", action.payload);
    },

    //Action pour unLiker un commentaire
    unLikeCommentRequested: (
      state,
      action: PayloadAction<{
        postId: string;
        commentId: string;
        userId: string;
      }>
    ) => {
      console.log("Unlike commentaire en cours...", action.payload);
    },

    unLikeCommentSuccess: (state, action: PayloadAction<Post>) => {
      if (state.posts) {
        state.posts = state.posts.map((post) =>
          post._id === action.payload._id ? action.payload : post
        );
      }
    },

    unLikeCommentFailed: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      console.log("Unlike comment échoué...", action.payload);
    },

    //Action pour aujouter un post au favoris
    savePostRequested: (
      state,
      action: PayloadAction<{ postId: string; userId: string }>
    ) => {
      console.log("Ajout du post au favori en cours...", action.payload);
    },

    savePostSuccess: (state, action: PayloadAction<Post>) => {
      if (state.posts) {
        state.posts = state.posts.map((post) =>
          post._id === action.payload._id ? action.payload : post
        );
      }
    },

    savePostFailed: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      console.log("Ajout du post au favori  échoué...", action.payload);
    },

    //Action pour retiré le poste des favoris
    unSavePostRequested: (
      state,
      action: PayloadAction<{ postId: string; userId: string }>
    ) => {
      console.log("Retrait du post des favoris en cours...", action.payload);
    },

    unSavePostSuccess: (state, action: PayloadAction<Post>) => {
      if (state.posts) {
        state.posts = state.posts.map((post) =>
          post._id === action.payload._id ? action.payload : post
        );
      }
    },

    unSavePostFailed: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      console.log("Retrait du post des favoris  échoué...", action.payload);
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
  createCommentFailed,
  createCommentRequested,
  createCommentSuccess,
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
