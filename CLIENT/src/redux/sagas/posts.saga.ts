import { call, put, takeLatest } from "redux-saga/effects";
import { Post } from "../../types/post.types";
import {
  getPostsSuccess,
  getPostsFailed,
  getPostsRequested,
  updatePostSuccess,
  updatePostRequested,
  getPostSuccess,
  getPostRequested,
  updatePostFailed,
  deletePostRequested,
  deletePostFailed,
  deletePostSuccess,
  createPostSuccess,
  createPostRequested,
  createPostFailed,
  createCommentFailed,
  createCommentSuccess,
  createCommentRequested,
  deleteCommentRequested,
  deleteCommentFailed,
  deleteCommentSuccess,
  likePostSuccess,
  likePostFailed,
  likePostRequested,
  unLikePostSuccess,
  unLikePostRequested,
  unLikeCommentFailed,
  likeCommentSuccess,
  unLikeCommentSuccess,
  likeCommentFailed,
  likeCommentRequested,
  unLikeCommentRequested,
  savePostSuccess,
  savePostFailed,
  unSavePostSuccess,
  unSavePostFailed,
  unSavePostRequested,
  savePostRequested,
  getPostsByFollowingSuccess,
  getPostsByFollowingFailed,
  getPostsByFollowingRequested,
  getPostsForYouRequested,
  getPostsForYouSuccess,
} from "../reducers/posts.reducer";
import {
  addCommentPost,
  addLikeComment,
  addLikePost,
  createPost,
  deleteCommentPost,
  deletePost,
  dislikePost,
  getPost,
  getPosts,
  getPostsByFollowing,
  getPostsForYou,
  savePost,
  unLikeComment,
  unSavePost,
  updatePost,
} from "../../services/postService";
import { PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
  getPostsSavedRequested,
  getPostsUserRequested,
} from "../reducers/user.reducer";

let selectedFile: File | null = null;

export function setSelectedPicturePost(file: File | null) {
  selectedFile = file;
}

// Fonction pour récupérer les posts
function* handleFetchPosts(
  action: PayloadAction<{ skip: number; limit: number }>
): Generator<any, void, Post[]> {
  try {
    const { skip, limit } = action.payload;
    const posts = yield call(getPosts, skip, limit); // ✅ OK
    console.log("Posts récupérés :", posts);
    yield put(getPostsSuccess(posts));
  } catch (error: any) {
    yield put(getPostsFailed(error.message));
  }
}

// Fonction pour récupérer un post
function* handleFetchPost(
  action: PayloadAction<string>
): Generator<any, void, Post> {
  try {
    const post = yield call(getPost, action.payload);
    yield put(getPostSuccess(post));
  } catch (error: any) {
    yield put(getPostsFailed(error.message));
  }
}

// Fonction pour récupérer les posts des followings
function* handleFetchPostsFollowing(
  action: PayloadAction<{ userId: string; skip: number; limit: number }>
): Generator<any, void, Post[]> {
  try {
    const { userId, skip, limit } = action.payload;
    const followingPosts = yield call(getPostsByFollowing, userId, skip, limit);
    yield put(
      getPostsByFollowingSuccess({
        followingPosts,
        hasMore: followingPosts.length === limit, // Vérifie s'il y a plus de posts à charger
        skip,
      })
    );
    // console.log("Posts des followings récupérés :", followingPosts); //
  } catch (error: any) {
    yield put(getPostsByFollowingFailed(error.message));
    console.error(
      "Erreur lors de la récupération des posts des followings :",
      error
    );
  }
}

// Saga pour récupérer les posts for you
function* handleFetchPostsForYou(
  action: PayloadAction<{ userId: string; skip: number; limit: number }>
): Generator<any, void, Post[]> {
  try {
    const { userId, skip, limit } = action.payload;
    const forYouPosts = yield call(getPostsForYou, userId, skip, limit);
    yield put(
      getPostsForYouSuccess({
        forYouPosts,
        hasMore: forYouPosts.length === limit,
      })
    );
    //console.log("Posts for you récupérés :", forYouPosts);
  } catch (error: any) {
    yield put(getPostsFailed(error.message));
    console.error("Erreur lors de la récupération des posts for you :", error);
  }
}

/** ✅ Saga pour modifier un post */
function* handleUpdatePost(
  action: PayloadAction<{ _id: string; data: Post }>
): Generator<any, void, Post> {
  try {
    const updatedPost: Post = yield call(
      updatePost,
      action.payload._id,
      action.payload.data
    );
    yield put(updatePostSuccess(updatedPost)); // ✅ Mise à jour locale du post
    yield put(getPostRequested(action.payload._id)); // ✅ Rafraîchissement du posts
    toast.success("Post modifié avec succès !");
  } catch (error: any) {
    toast.error(error.response?.data?.message || "Une erreur est survenue !");
    yield put(updatePostFailed(error.message));
    console.error("Erreur lors de la mise à jour du post :", error.message);
  }
}

// Fonction pour créer un post
// function* handleCreatePost(
//   action: PayloadAction<{ message: string; posterId: string }>
// ): Generator<any, void, Post> {
//   try {
//     const formData = new FormData();
//     formData.append("posterId", action.payload.posterId);
//     formData.append("message", action.payload.message);
//     if (selectedFile) {
//       formData.append("postImage", selectedFile);
//     }
//     const createdPost = yield call(createPost, formData);
//     yield put(createPostSuccess(createdPost));
//     // yield put(getPostsRequested({ skip: 0, limit: 5 })); // Rafraîchir la liste des posts
//     toast.success("Publication créée avec succès !");
//   } catch (error: any) {
//     toast.error(error.response?.data?.message || "Une erreur est survenue !");
//     yield put(createPostFailed(error.message));
//   }
// }

// Fonction pour créer un post avec cloudinary
function* handleCreatePost(
  action: PayloadAction<{
    message: string;
    posterId: string;
    pictureUrl?: string;
    publicId?: string;
  }>
): Generator<any, void, Post> {
  try {
    const { message, posterId, pictureUrl, publicId } = action.payload;

    // Appel de l'API pour créer le post
    const createdPost = yield call(createPost, {
      pictureUrl,
      publicId,
      message,
      posterId,
    });
    console.log("Post créé :", createdPost);
    yield put(createPostSuccess(createdPost));
    yield put(
      getPostsByFollowingRequested({ userId: posterId, skip: 0, limit: 5 })
    ); // Rafraîchir la liste des posts
    toast.success("Publication créée avec succès !");
  } catch (error: any) {
    toast.error(error.response?.data?.message || "Une erreur est survenue !");
    yield put(createPostFailed(error.message));
  }
}

// Fonction pour supprimer un post
function* handleDeletePost(
  action: PayloadAction<{ postId: string; userId: string }>
): Generator<any, void, Post> {
  try {
    //appel api
    yield call(deletePost, action.payload.postId);
    //appel saga
    yield put(deletePostSuccess(action.payload.postId));
    yield put(getPostsUserRequested(action.payload.userId));
    yield put(
      getPostsByFollowingRequested({
        userId: action.payload.userId,
        skip: 0,
        limit: 5,
      })
    );
    toast.success("Post supprimé avec succès !");
  } catch (error: any) {
    toast.error(error.response?.data?.message || "Une erreur est survenue !");
    yield put(deletePostFailed(error.message));
    console.error("Erreur lors de la mise à jour du post :", error.message);
  }
}

/*Le principe est que on appel l'api por mettre à jour le post avec son nouveau commentaire
//   et ce dernier nous renvoie le post à jour q'on va donner à notre reducer pour mettre à jour le store donc l'affiche */
function* handleAddComment(
  action: PayloadAction<{
    _id: string;
    commenterId: string;
    text: string;
  }>
): Generator<any, void, Post> {
  try {
    const createdComment = yield call(
      addCommentPost,
      action.payload._id,
      action.payload.commenterId,
      action.payload.text
    );

    yield put(createCommentSuccess(createdComment));
    toast.success("Votre commentaire a été envoyé avec succès !");
    // ✅ Rafraîchir le post après l'ajout du commentaire
    yield put(getPostRequested(action.payload._id));
  } catch (error: any) {
    console.error("Erreur lors de l'ajout du commentaire :", error);

    // Vérification et gestion de l'erreur proprement
    const errorMessage =
      error.response?.data?.message || "Une erreur est survenue.";
    toast.error(errorMessage);
    yield put(createCommentFailed(errorMessage));
  }
}

// Fonction pour supprimer un commentaire
function* handleDeleteComment(
  action: PayloadAction<{ postId: string; commentId: string }>
): Generator<any, void, Post> {
  try {
    yield call(
      deleteCommentPost,
      action.payload.postId,
      action.payload.commentId
    );

    yield put(
      deleteCommentSuccess({
        postId: action.payload.postId,
        commentId: action.payload.commentId,
      })
    );
    yield put(getPostRequested(action.payload.postId));
  } catch (error: any) {
    console.log("Erreur lors du suppression du commentaire");
    yield put(deleteCommentFailed(error.message));
  }
}

// Fonction pour liker un post
function* handleLikePost(
  action: PayloadAction<{ postId: string; userId: string }>
): Generator<any, void, Post> {
  try {
    const likedPost = yield call(
      addLikePost,
      action.payload.postId,
      action.payload.userId
    );
    console.log("Post liké :", likedPost);
    yield put(likePostSuccess(likedPost)); // Mettre à jour le post dans le store
    // Rafraîchir le post après l'ajout du like
    yield put(getPostRequested(action.payload.postId));
  } catch (error: any) {
    console.error("Erreur lors de l'ajout du like :", error);
    yield put(likePostFailed(error.message));
  }
}

//Fonction pour unliker un post
function* handleUnLikePost(
  action: PayloadAction<{ postId: string; userId: string }>
): Generator<any, void, Post> {
  try {
    const unlikedPost = yield call(
      dislikePost,
      action.payload.postId,
      action.payload.userId
    );
    console.log("Post disliké :", unlikedPost);
    yield put(unLikePostSuccess(unlikedPost)); // Mettre à jour le post dans le store
    yield put(getPostRequested(action.payload.postId)); // Rafraîchir le post après l'ajout du like
  } catch (error: any) {
    console.error("Erreur lors de la suppression du like :", error);
    yield put(likePostFailed(error.message));
  }
}

//Fonction pour liker un commentaire
function* handleLikeComment(
  action: PayloadAction<{ postId: string; commentId: string; userId: string }>
): Generator<any, void, Post> {
  try {
    const likedComment = yield call(
      addLikeComment,
      action.payload.postId,
      action.payload.commentId,
      action.payload.userId
    );

    console.log("Commentaire liké:", likedComment);
    yield put(likeCommentSuccess(likedComment));
    yield put(getPostRequested(action.payload.postId));
  } catch (error: any) {
    console.error("Erreur lors de l'ajout du like sur le commentaire :", error);
    yield put(likeCommentFailed(error.message));
  }
}

//Fonction pour unliker un commentaire
function* handleUnLikeComment(
  action: PayloadAction<{ postId: string; commentId: string; userId: string }>
): Generator<any, void, Post> {
  try {
    const unLikedComment = yield call(
      unLikeComment,
      action.payload.postId,
      action.payload.commentId,
      action.payload.userId
    );

    console.log("Commentaire unliké:", unLikedComment);
    yield put(unLikeCommentSuccess(unLikedComment));
    yield put(getPostRequested(action.payload.postId));
  } catch (error: any) {
    console.error("Erreur lors de l'ajout du like sur le commentaire :", error);
    yield put(unLikeCommentFailed(error.message));
  }
}

//Fonction sage pour ajouter un post au favoris
function* handleSavePost(
  action: PayloadAction<{ postId: string; userId: string }>
): Generator<any, void, Post> {
  try {
    const savedPost = yield call(
      savePost,
      action.payload.postId,
      action.payload.userId
    );
    console.log("Post sauvegardé :", savedPost);
    yield put(savePostSuccess(savedPost));
    yield put(getPostRequested(action.payload.postId)); // Mettre à jour le post sauvegardé sur le store
    // Rafraîchir la liste des posts sauvegardés
    yield put(getPostsSavedRequested(action.payload.userId));
  } catch (error: any) {
    console.error("Erreur lors de l'ajout du post aux favoris :", error);
    yield put(savePostFailed(error.message));
  }
}

//Fonction sage pour ajouter un post au favoris
function* handleUnSavePost(
  action: PayloadAction<{ postId: string; userId: string }>
): Generator<any, void, Post> {
  try {
    const unSavedPost = yield call(
      unSavePost,
      action.payload.postId,
      action.payload.userId
    );
    console.log("Post retiré :", unSavedPost);
    yield put(unSavePostSuccess(unSavedPost));
    yield put(getPostRequested(action.payload.postId)); // Mettre à jour le post sauvegardé sur le store
    yield put(getPostsSavedRequested(action.payload.userId)); // Rafraîchir la liste des posts sauvegardés
  } catch (error: any) {
    console.error("Erreur lors de l'ajout du post aux favoris :", error);
    yield put(unSavePostFailed(error.message));
  }
}
export default function* postsSaga() {
  yield takeLatest(getPostsRequested.type, handleFetchPosts);
  yield takeLatest(updatePostRequested.type, handleUpdatePost);
  yield takeLatest(getPostRequested.type, handleFetchPost);
  yield takeLatest(deletePostRequested.type, handleDeletePost);
  yield takeLatest(createPostRequested.type, handleCreatePost);
  yield takeLatest(createCommentRequested.type, handleAddComment);
  yield takeLatest(deleteCommentRequested.type, handleDeleteComment);
  yield takeLatest(likePostRequested.type, handleLikePost);
  yield takeLatest(unLikePostRequested.type, handleUnLikePost);
  yield takeLatest(likeCommentRequested.type, handleLikeComment);
  yield takeLatest(unLikeCommentRequested.type, handleUnLikeComment);
  yield takeLatest(savePostRequested.type, handleSavePost);
  yield takeLatest(unSavePostRequested.type, handleUnSavePost);
  yield takeLatest(
    getPostsByFollowingRequested.type,
    handleFetchPostsFollowing
  );
  yield takeLatest(getPostsForYouRequested.type, handleFetchPostsForYou);
}

// function* getPosts() {
//     try {
//         const response: AxiosResponse<Post[]> = yield axios.get("http://localhost:8000/api/post/");
//         yield put (getPostsSuccess(response.data));
//     } catch (error: any) {
//         yield put(getPostsFailed(error.message))
//     }
// }
