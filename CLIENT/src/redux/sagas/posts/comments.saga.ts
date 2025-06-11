// comments.saga.ts
import { call, put } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { Post } from "src/types/post.types";
import {
  createCommentSuccess,
  createCommentFailed,
  deleteCommentSuccess,
  deleteCommentFailed,
  getPostRequested,
  likeCommentSuccess,
  likeCommentFailed,
  unLikeCommentSuccess,
  unLikeCommentFailed,
} from "src/redux/reducers/posts.reducer";

import { toast } from "react-toastify";
import {
  addCommentPost,
  deleteCommentPost,
} from "src/services/posts/postService";

// 💬 Saga - Ajouter un commentaire à un post
export function* handleAddComment(
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
    yield put(getPostRequested(action.payload._id)); // 🔄 Rafraîchir le post
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Une erreur est survenue.";
    toast.error(errorMessage);
    yield put(createCommentFailed(errorMessage));
  }
}

// ❌ Saga - Supprimer un commentaire d'un post
export function* handleDeleteComment(
  action: PayloadAction<{ postId: string; commentId: string }>
): Generator<any, void, Post> {
  try {
    yield call(
      deleteCommentPost,
      action.payload.postId,
      action.payload.commentId
    );
    yield put(deleteCommentSuccess(action.payload));
    yield put(getPostRequested(action.payload.postId));
  } catch (error: any) {
    console.log("Erreur lors de la suppression du commentaire");
    yield put(deleteCommentFailed(error.message));
  }
}
