import { call, put } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { followUser, getUser, unFollowUser } from "src/services/userService";

import { User } from "src/types/user.types";
import { getPostsByFollowingRequested } from "src/redux/reducers/posts.reducer";
import {
  followUserSuccess,
  followUserFailed,
  unfollowUserFailed,
  unfollowUserSuccess,
} from "src/redux/reducers/user.reducer";
import { getUsersRequested } from "src/redux/reducers/users.reducer";
import { getUserByUsernameRequested } from "src/redux/reducers/viewed-user.reducer";

/**
 * Saga pour suivre un utilisateur
 * @param action - contient l'id de l'utilisateur actuel et celui à suivre
 */
export function* handleFollowUser(
  action: PayloadAction<{ userId: string; userIdToFollow: string }>
): Generator<any, void, User> {
  try {
    // Appel API pour suivre l'utilisateur
    const followedUser = yield call(
      followUser,
      action.payload.userId,
      action.payload.userIdToFollow
    );

    // Mise à jour du state avec succès
    yield put(followUserSuccess(followedUser));

    // Rafraîchit la liste des utilisateurs
    yield put(getUsersRequested());

    // Rafraîchit l'utilisateur ciblé
    const user = yield call(getUser, action.payload.userIdToFollow);
    yield put(getUserByUsernameRequested(user.userName));

    // Rafraîchit les posts des abonnements
    yield put(
      getPostsByFollowingRequested({
        userId: action.payload.userId,
        skip: 0,
        limit: 5,
      })
    );
  } catch (error: any) {
    yield put(followUserFailed(error.message));
    toast.error("Impossible de suivre l'utilisateur.");
  }
}

/**
 * Saga pour ne plus suivre un utilisateur
 * @param action - contient l'id de l'utilisateur actuel et celui à ne plus suivre
 */
export function* handleUnfollowUser(
  action: PayloadAction<{ userId: string; userIdToUnfollow: string }>
): Generator<any, void, User> {
  try {
    // Appel API pour unfollow
    const unfollowedUser = yield call(
      unFollowUser,
      action.payload.userId,
      action.payload.userIdToUnfollow
    );

    // Mise à jour du state avec succès
    yield put(unfollowUserSuccess(unfollowedUser));
    yield put(getUsersRequested());

    // Rafraîchit l'utilisateur ciblé
    const user = yield call(getUser, action.payload.userIdToUnfollow);
    yield put(getUserByUsernameRequested(user.userName));

    // Rafraîchit les posts des abonnements
    yield put(
      getPostsByFollowingRequested({
        userId: action.payload.userId,
        skip: 0,
        limit: 5,
      })
    );
  } catch (error: any) {
    yield put(unfollowUserFailed(error.message));
    toast.error("Impossible de ne plus suivre l'utilisateur.");
  }
}
