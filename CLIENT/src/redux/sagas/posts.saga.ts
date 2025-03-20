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
  disLikePostSuccess,
  disLikePostRequested,
} from "../reducers/posts.reducer";
import {
  addCommentPost,
  addLikePost,
  createPost,
  deleteCommentPost,
  deletePost,
  dislikePost,
  getPost,
  getPosts,
  updatePost,
} from "../../services/postService";
import { PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

// Fonction pour récupérer les posts
function* handleFetchPosts(): Generator<any, void, Post[]> {
  try {
    const posts = yield call(getPosts);
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
function* handleCreatePost(
  action: PayloadAction<{ message: string; posterId: string; postImage?: File }>
): Generator<any, void, Post> {
  try {
    const formData = new FormData();
    formData.append("posterId", action.payload.posterId);
    formData.append("message", action.payload.message);
    if (action.payload.postImage) {
      formData.append("postImage", action.payload.postImage);
    }
    const createdPost = yield call(createPost, formData);
    yield put(createPostSuccess(createdPost));
    yield put(getPostsRequested());
    toast.success("Publication créée avec succès !");
  } catch (error: any) {
    toast.error(error.response?.data?.message || "Une erreur est survenue !");
    yield put(createPostFailed(error.message));
  }
}

// Fonction pour supprimer un post
function* handleDeletePost(
  action: PayloadAction<string>
): Generator<any, void, Post> {
  try {
    //appel api
    yield call(deletePost, action.payload);
    //appel saga
    yield put(deletePostSuccess(action.payload));
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
    yield put(likePostSuccess(likedPost));
    yield put(getPostRequested(action.payload.postId));
  } catch (error: any) {
    console.error("Erreur lors de l'ajout du like :", error);
    yield put(likePostFailed(error.message));
  }
}

//Fonction pour disliker un post
function* handleDisLikePost(
  action: PayloadAction<{ postId: string; userId: string }>
): Generator<any, void, Post> {
  try {
    const dislikedPost = yield call(
      dislikePost,
      action.payload.postId,
      action.payload.userId
    );
    console.log("Post disliké :", dislikedPost);
    yield put(disLikePostSuccess(dislikedPost));
    yield put(getPostRequested(action.payload.postId));
  } catch (error: any) {
    console.error("Erreur lors de la suppression du like :", error);
    yield put(likePostFailed(error.message));
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
  yield takeLatest(disLikePostRequested.type, handleDisLikePost);
}

// function* getPosts() {
//     try {
//         const response: AxiosResponse<Post[]> = yield axios.get("http://localhost:8000/api/post/");
//         yield put (getPostsSuccess(response.data));
//     } catch (error: any) {
//         yield put(getPostsFailed(error.message))
//     }
// }
