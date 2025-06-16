// likes.saga.ts
import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLatest } from "redux-saga/effects";
import { Post } from "src/types/post.types";
import { toast } from "react-toastify";

import {
  getPostRequested,
  likePostSuccess,
  likePostFailed,
  unLikePostSuccess,
  likeCommentSuccess,
  likeCommentFailed,
  unLikeCommentSuccess,
  unLikeCommentFailed,
} from "src/redux/reducers/posts.reducer";
import {
  addLikeComment,
  addLikePost,
  dislikePost,
  unLikeComment,
} from "src/services/posts/postService";

// ✅ Saga pour liker un post
export function* handleLikePost(
  action: PayloadAction<{ postId: string }>
): Generator<any, void, Post> {
  try {
    const likedPost = yield call(addLikePost, action.payload.postId);
    yield put(likePostSuccess(likedPost));
    yield put(getPostRequested(action.payload.postId)); // Rafraîchir le post
  } catch (error: any) {
    toast.error("Erreur lors du like du post");
    yield put(likePostFailed(error.message));
  }
}

// ✅ Saga pour unliker un post
export function* handleUnLikePost(
  action: PayloadAction<{ postId: string }>
): Generator<any, void, Post> {
  try {
    const unlikedPost = yield call(dislikePost, action.payload.postId);
    yield put(unLikePostSuccess(unlikedPost));
    yield put(getPostRequested(action.payload.postId)); // Rafraîchir le post
  } catch (error: any) {
    toast.error("Erreur lors du retrait du like du post");
    yield put(likePostFailed(error.message));
  }
}

// ✅ Saga pour liker un commentaire
export function* handleLikeComment(
  action: PayloadAction<{ postId: string; commentId: string; userId: string }>
): Generator<any, void, Post> {
  try {
    const likedComment = yield call(
      addLikeComment,
      action.payload.postId,
      action.payload.commentId
    );
    yield put(likeCommentSuccess(likedComment));
    yield put(getPostRequested(action.payload.postId)); // Rafraîchir le post
  } catch (error: any) {
    toast.error("Erreur lors du like du commentaire");
    yield put(likeCommentFailed(error.message));
  }
}

// ✅ Saga pour unliker un commentaire
export function* handleUnLikeComment(
  action: PayloadAction<{ postId: string; commentId: string }>
): Generator<any, void, Post> {
  try {
    const unlikedComment = yield call(
      unLikeComment,
      action.payload.postId,
      action.payload.commentId
    );
    yield put(unLikeCommentSuccess(unlikedComment));
    yield put(getPostRequested(action.payload.postId)); // Rafraîchir le post
  } catch (error: any) {
    toast.error("Erreur lors du retrait du like du commentaire");
    yield put(unLikeCommentFailed(error.message));
  }
}
