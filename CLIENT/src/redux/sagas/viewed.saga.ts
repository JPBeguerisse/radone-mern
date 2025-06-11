import { PayloadAction } from "@reduxjs/toolkit";
import { getUserByUsername } from "src/services/userService";
import { User } from "src/types/user.types";
import {
  getPostsByUserFailed,
  getPostsByUserRequested,
  getPostsByUserSuccess,
  getUserByUsernameFailed,
  getUserByUsernameRequested,
  getUserByUsernameSuccess,
} from "../reducers/viewed-user.reducer";
import { call, put, takeEvery } from "redux-saga/effects";
import { getPostsByUser } from "src/services/posts/postService";
import { Post } from "src/types/post.types";

// fonction pour récupérer un utilisateur par son username
function* handleGetUserByUsername(
  action: PayloadAction<string>
): Generator<any, void, User> {
  try {
    // const token = localStorage.getItem("accessToken");
    const user = yield call(getUserByUsername, action.payload);
    //console.log("USER RES", user);
    yield put(getUserByUsernameSuccess(user));
  } catch (error: any) {
    yield put(getUserByUsernameFailed(error.message));
  }
}

function* handleFetchPostsUser(
  action: PayloadAction<string>
): Generator<any, void, Post[]> {
  try {
    const posts = yield call(getPostsByUser, action.payload);
    yield put(getPostsByUserSuccess(posts));
  } catch (error: any) {
    yield put(getPostsByUserFailed(error.message));
  }
}

export default function* viewedUserSaga() {
  yield takeEvery(getUserByUsernameRequested, handleGetUserByUsername);
  yield takeEvery(getPostsByUserRequested, handleFetchPostsUser);
}
