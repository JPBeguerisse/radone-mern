import axios, { AxiosResponse } from "axios";
import { put, takeEvery, takeLatest } from "redux-saga/effects";
import { User } from "../types/user.types";
import {
  getUsersFailed,
  getUsersRequested,
  getUsersSuccess,
} from "../reducers/users.reducer";

function* getUsers() {
  try {
    const response: AxiosResponse<User[]> = yield axios.get(
      "http://localhost:8000/api/user/"
    );
    yield put(getUsersSuccess(response.data));
    //console.log(response.data)
  } catch (error: any) {
    yield put(getUsersFailed(error.message));
  }
}

export default function* usersSaga() {
  yield takeEvery(getUsersRequested.type, getUsers);
}
