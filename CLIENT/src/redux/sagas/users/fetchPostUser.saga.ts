import { call, put } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { getUser } from "src/services/userService";
import { User } from "src/types/user.types";
import {
  getUserSuccess,
  getUserFailed,
  getPostsUserFailed,
  getPostsUserSuccess,
  getPostsSavedFailed,
  getPostsSavedSuccess,
} from "src/redux/reducers/user.reducer";

import { Post } from "src/types/post.types";
import { toast } from "react-toastify";
import {
  getPostsByUserId,
  getSavedPostsByUser,
} from "src/services/posts/postService";

/**
 * Saga pour récupérer les publications d’un utilisateur
 * @param action - contient l'identifiant de l'utilisateur
 */
export function* handleGetPostsUser(
  action: PayloadAction<string>
): Generator<any, void, Post[]> {
  try {
    const posts = yield call(getPostsByUserId, action.payload); // API call
    yield put(getPostsUserSuccess(posts)); // Mise à jour du store
  } catch (error: any) {
    yield put(getPostsUserFailed(error.message)); // Gestion d'erreur
  }
}

/**
 * Saga pour récupérer les publications sauvegardées d’un utilisateur
 * @param action - contient l'identifiant de l'utilisateur
 */
export function* handleGetPostsSaved(
  action: PayloadAction<string>
): Generator<any, void, Post[]> {
  try {
    const posts = yield call(getSavedPostsByUser, action.payload); // API call
    yield put(getPostsSavedSuccess(posts)); // Mise à jour du store avec les posts
  } catch (error: any) {
    yield put(getPostsSavedFailed(error.message)); // Gestion d'erreur
    toast.error("Échec de la récupération des publications sauvegardées.");
  }
}
