//user.saga/ts
import { takeLatest } from "redux-saga/effects";
import {
  getUserRequested,
  updateUserRequested,
  followUserRequested,
  unfollowUserRequested,
  getPostsSavedRequested,
  getPostsUserRequested,
  updateProfilePictureRequested,
  removeProfilePictureRequested,
} from "../reducers/user.reducer";
import {
  handleGetPostsSaved,
  handleGetPostsUser,
} from "./users/fetchPostUser.saga";
import {
  handleRemoveProfilePicture,
  handleUpdateProfilePicture,
  handleUpdateUser,
} from "./users/updateUser.saga";
import { handleFollowUser, handleUnfollowUser } from "./users/followUser.saga";
import { handleGetUser } from "./users/fetchUser.saga";

/**
 * Saga pour gérer les actions liées à l'utilisateur
 * - Récupération des informations utilisateur
 * - Mise à jour des informations utilisateur
 * - Suivre/ne plus suivre un utilisateur
 * - Récupération des posts sauvegardés et de l'utilisateur
 * - Mise à jour et suppression de la photo de profil
 */
// Watcher saga : surveille les actions de type "GET_USER_REQUESTED" et appelle `getUser`
export default function* userSaga() {
  // `takeLatest` va écouter "GET_USER_REQUESTED" et appeler `getUser` avec l'action dispatchée
  yield takeLatest(getUserRequested.type, handleGetUser);
  yield takeLatest(updateUserRequested.type, handleUpdateUser);
  yield takeLatest(followUserRequested.type, handleFollowUser);
  yield takeLatest(unfollowUserRequested.type, handleUnfollowUser);
  yield takeLatest(getPostsSavedRequested.type, handleGetPostsSaved);
  yield takeLatest(getPostsUserRequested.type, handleGetPostsUser);
  yield takeLatest(
    updateProfilePictureRequested.type,
    handleUpdateProfilePicture
  );
  yield takeLatest(
    removeProfilePictureRequested.type,
    handleRemoveProfilePicture
  );
  // yield takeLatest(getUserByUsernameRequested.type, handleGetUserByUsername);
}
