import { call, put } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { Post } from "src/types/post.types";

import { toast } from "react-toastify";
import {
  savePostSuccess,
  getPostRequested,
  savePostFailed,
  unSavePostSuccess,
  unSavePostFailed,
} from "src/redux/reducers/posts.reducer";
import { getPostsSavedRequested } from "src/redux/reducers/user.reducer";
import { savePost, unSavePost } from "src/services/posts/postService";

/** Saga pour sauvegarder un post */
export function* handleSavePost(
  action: PayloadAction<{ postId: string; userId: string }>
): Generator<any, void, Post> {
  try {
    const savedPost = yield call(
      savePost,
      action.payload.postId,
      action.payload.userId
    );

    yield put(savePostSuccess(savedPost));
    yield put(getPostRequested(action.payload.postId)); // 🔄 Met à jour le post avec les données mises à jour
    yield put(getPostsSavedRequested(action.payload.userId)); // 🔄 Rafraîchir la liste des posts sauvegardés

    // toast.success("Post ajouté aux favoris !");
  } catch (error: any) {
    console.error("Erreur lors de la sauvegarde du post :", error);
    yield put(savePostFailed(error.message));
    toast.error("Erreur lors de la sauvegarde.");
  }
}

/**  Saga pour retirer un post des favoris */
export function* handleUnSavePost(
  action: PayloadAction<{ postId: string; userId: string }>
): Generator<any, void, Post> {
  try {
    const unSavedPost = yield call(
      unSavePost,
      action.payload.postId,
      action.payload.userId
    );

    yield put(unSavePostSuccess(unSavedPost));
    yield put(getPostRequested(action.payload.postId)); // 🔄 Met à jour le post
    yield put(getPostsSavedRequested(action.payload.userId)); // 🔄 Met à jour les favoris

    // toast.success("Post retiré des favoris !");
  } catch (error: any) {
    console.error("Erreur lors de la suppression des favoris :", error);
    yield put(unSavePostFailed(error.message));
    toast.error("Erreur lors de la suppression.");
  }
}
