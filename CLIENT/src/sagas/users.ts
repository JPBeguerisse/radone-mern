import axios, { AxiosResponse } from 'axios';
import { put, takeLatest } from "redux-saga/effects";
import { User } from '../actions/users/user';

function* getUsers() {
    try {
      const response: AxiosResponse<User[]> = yield axios.get("http://localhost:8000/api/user/");
      yield put({ type: "GET_USERS_SUCCESS", payload: response.data });
    } catch (error: any) {
      yield put({ type: "GET_USERS_FAILED", message: error.message });
    }
  }
  
  export function* usersSaga() {
    yield takeLatest("GET_USERS_REQUESTED", getUsers);
  }