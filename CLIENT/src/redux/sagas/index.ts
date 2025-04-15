// redux/sagas/index.ts
import { all } from "redux-saga/effects";
import postsSaga from "./posts.saga";
import userSaga from "./user.saga";
import usersSaga from "./users.saga";
import viewedUserSaga from "./viewed.saga";

export default function* rootSaga() {
  yield all([
    postsSaga(), // Initialise les effets pour les posts
    userSaga(), // Initialise les effets pour les utilisateurs
    usersSaga(),
    viewedUserSaga(), // Initialise les effets pour l'utilisateur vu
  ]);
}
