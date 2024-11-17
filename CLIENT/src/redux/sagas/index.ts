// redux/sagas/index.ts
import { all } from 'redux-saga/effects';
import postsSaga from './posts.saga';
import userSaga from './user.saga';
import usersSaga from './users.saga';


export default function* rootSaga() {
  yield all([
    postsSaga(),  // Initialise les effets pour les posts
    userSaga(),  // Initialise les effets pour les utilisateurs
    usersSaga()
  ]);
}
