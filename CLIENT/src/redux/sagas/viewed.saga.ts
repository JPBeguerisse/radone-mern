import { PayloadAction } from "@reduxjs/toolkit";
import { getUserByUsername } from "src/services/userService";
import { User } from "src/types/user.types";
import {
  getUserByUsernameFailed,
  getUserByUsernameRequested,
  getUserByUsernameSuccess,
} from "../reducers/viewed-user.reducer";
import { call, put, takeEvery } from "redux-saga/effects";

// fonction pour récupérer un utilisateur par son username
function* handleGetUserByUsername(
  action: PayloadAction<string>
): Generator<any, void, User> {
  try {
    const token = localStorage.getItem("accessToken");
    const user = yield call(getUserByUsername, action.payload);
    //console.log("USER RES", user);
    yield put(getUserByUsernameSuccess(user));
  } catch (error: any) {
    yield put(getUserByUsernameFailed(error.message));
  }
}

export default function* watchGetUserByUsername() {
  yield takeEvery(getUserByUsernameRequested, handleGetUserByUsername);
}
