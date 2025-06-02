import { call, put, takeEvery } from "redux-saga/effects";
import { User } from "../../types/user.types";
import {
  getUsersFailed,
  getUsersRequested,
  getUsersSuccess,
} from "../reducers/users.reducer";
import { getUsers } from "../../services/userService";

function* handleFetchUsers(): Generator<any, void, User[]> {
  try {
    const users = yield call(getUsers);
    yield put(getUsersSuccess(users));
  } catch (error: any) {
    yield put(getUsersFailed(error.message));
  }
}

export default function* usersSaga() {
  yield takeEvery(getUsersRequested.type, handleFetchUsers);
}

// function* getUsers() {
//   try {
//     const response: AxiosResponse<User[]> = yield axios.get(
//       "http://localhost:8000/api/user/"
//     );
//     yield put(getUsersSuccess(response.data));
//     //console.log(response.data)
//   } catch (error: any) {
//     yield put(getUsersFailed(error.message));
//   }
// }
