//user.saga/ts
import { call, put, takeLatest } from "redux-saga/effects";
import { UpdateUserPayload, User } from "../../types/user.types";
import {
  getUserRequested,
  getUserFailed,
  getUserSuccess,
  updateUserFailed,
  updateUserSuccess,
  updateUserRequested,
  updatePictureSuccess,
  updatePictureRequested,
  removePictureSuccess,
  removePictureRequested,
  followUserSuccess,
  followUserFailed,
  unfollowUserSuccess,
  unfollowUserFailed,
  followUserRequested,
  unfollowUserRequested,
  getPostsSavedFailed,
  getPostsSavedSuccess,
  getPostsSavedRequested,
  getPostsUserFailed,
  getPostsUserSuccess,
  getPostsUserRequested,
  updateProfilePictureRequested,
  updateProfilePictureSuccess,
  updateProfilePictureFailed,
  removeProfilePictureSuccess,
  removeProfilePictureRequested,
} from "../reducers/user.reducer";
import { PayloadAction } from "@reduxjs/toolkit";
import {
  deleteProfilePicture,
  followUser,
  getUser,
  removePicture,
  unFollowUser,
  updatePicture,
  updateUser,
} from "../../services/userService";
import { toast } from "react-toastify";
import { getUsersRequested } from "../reducers/users.reducer";
import { Post } from "src/types/post.types";
import {
  getPostsByUserId,
  getSavedPostsByUser,
} from "src/services/postService";
import { getUserByUsernameRequested } from "../reducers/viewed-user.reducer";
import { getPostsByFollowingRequested } from "../reducers/posts.reducer";

let selectedFile: File | null = null;

export function setSelectedPicture(file: File | null) {
  selectedFile = file;
}

// fonction pour récupérer un utilisateur
function* handleGetUser(
  action: PayloadAction<string>
): Generator<any, void, User> {
  try {
    const token = localStorage.getItem("accessToken");
    const user = yield call(getUser, action.payload);
    //console.log("USER RES", user);
    yield put(getUserSuccess(user));
  } catch (error: any) {
    yield put(getUserFailed(error.message));
  }
}

// fonction pour récupérer les publications d'un utilisateur
function* handleGetPostsUser(
  action: PayloadAction<string>
): Generator<any, void, Post[]> {
  try {
    const token = localStorage.getItem("accessToken");
    const posts = yield call(getPostsByUserId, action.payload);
    yield put(getPostsUserSuccess(posts));
  } catch (error: any) {
    yield put(getPostsUserFailed(error.message));
  }
}

// fonction pour récupérer les publications sauvegarder d'un utilisateur
function* handleGetPostsSaved(
  action: PayloadAction<string>
): Generator<any, void, Post[]> {
  try {
    const posts = yield call(getSavedPostsByUser, action.payload);
    yield put(getPostsSavedSuccess(posts));
  } catch (error: any) {
    yield put(getPostsSavedFailed(error.message));
    toast.error("Échec de la récupération des publications sauvegardées.");
  }
}

// fonction pour mettre à jour un utilisateur
function* handleUpdateUser(
  action: PayloadAction<{ id: string; data: UpdateUserPayload }>
): Generator<any, void, User> {
  try {
    const token = localStorage.getItem("accessToken");
    const updatedUser = yield call(
      updateUser,
      action.payload.id,
      action.payload.data
    );

    yield put(updateUserSuccess(updatedUser));
    yield put(getUsersRequested());
    toast.success("Profil mis à jour avec succès !");
  } catch (error: any) {
    const response = error?.response?.data;
    // ✅ Envoie les erreurs spécifiques ou message général
    if (response?.errors) {
      yield put(updateUserFailed(response.errors)); // envoie les erreurs champ par champ
      console.log(response);
    } else {
      yield put(updateUserFailed(response?.message || "Erreur serveur"));
    }
    toast.error("Échec de la mise à jour du profil.");
  }
}

// fonction pour mettre à jour la photo de profil d'un utilisateur avec cloudinary
function* handleUpdateProfilePicture(
  action: PayloadAction<{
    userId: string;
    pictureUrl: string;
    public_id: string;
  }>
): Generator<any, void, User> {
  try {
    const { userId, pictureUrl, public_id } = action.payload;
    const updatedPicture = yield call(
      updatePicture,
      userId,
      pictureUrl,
      public_id
    );
    console.log("UPDATED PICTURE", updatedPicture);
    yield put(updateProfilePictureSuccess(updatedPicture));
    yield put(getUserRequested(userId));
    toast.success("Votre photo de profil a été modifié.");
  } catch (error: any) {
    yield put(updateProfilePictureFailed(error.message));
    toast.error("Échec de la mise à jour de la photo de profil.");
  }
}

// fonction pour supprimer la photo de profil d'un utilisateur aavec cloudinary
function* handleRemoveProfilePicture(
  action: PayloadAction<string>
): Generator<any, void, User> {
  try {
    const removedPicture = yield call(deleteProfilePicture, action.payload);
    yield put(removeProfilePictureSuccess(removedPicture));
    yield put(getUserRequested(action.payload));
    toast.success("Votre photo de profil a été supprimé.");
  } catch (error: any) {
    yield put(updateUserFailed(error.message));
    toast.error("Échec de la mise à jour de la photo de profil.");
  }
}

// fonction pour mettre à jour la photo de profil d'un utilisateur avec multipart/form-data non utilisée en ce moment
function* handleUpdatePictureUser(
  action: PayloadAction<string>
): Generator<any, void, User> {
  try {
    const formData = new FormData();
    formData.append("userId", action.payload);
    formData.append("profileImage", selectedFile!);
    // console.log(action.payload);

    //const updatedPicture = yield call(updatePicture, formData);
    // yield put(updatePictureSuccess(updatedPicture));
    // yield put(getUserRequested(action.payload));
    toast.success("Votre photo de profil a été modifié.");
  } catch (error: any) {
    yield put(updateUserFailed(error.message));
    toast.error("Échec de la mise à jour de la photo de profil.");
  }
}

// fonction pour supprimer la photo de profil d'un utilisateur avec multipart/form-data non utilisée en ce moment
function* handleRemovePictureUser(
  action: PayloadAction<string>
): Generator<any, void, User> {
  try {
    const removedPicture = yield call(removePicture, action.payload);
    yield put(removePictureSuccess(removedPicture));
    yield put(getUserRequested(action.payload));
    toast.success("Votre photo de profil a été supprimé.");
  } catch (error: any) {
    yield put(updateUserFailed(error.message));
    toast.error("Échec de la mise à jour de la photo de profil.");
  }
}

// fonction pour suivre un utilisateur
// `action` est passé à `handleFollowUser`, qui contient le `userId` et `userIdToFollow`
// `userId` est l'utilisateur qui suit
// `userIdToFollow` est l'utilisateur à suivre
// `action.payload` contient les données nécessaires
// `action.payload.userId` est l'utilisateur qui suit
// `action.payload.userIdToFollow` est l'utilisateur à suivre
// `followUser` est une fonction qui effectue la requête API pour suivre un utilisateur
// `put` est utilisé pour envoyer une action à Redux
// `call` est utilisé pour appeler une fonction de manière asynchrone
// `yield` est utilisé pour attendre la réponse de la fonction appelée
function* handleFollowUser(
  action: PayloadAction<{ userId: string; userIdToFollow: string }>
): Generator<any, void, User> {
  try {
    const followedUser = yield call(
      followUser,
      action.payload.userId,
      action.payload.userIdToFollow
    );
    yield put(followUserSuccess(followedUser));
    const user = yield call(getUser, action.payload.userIdToFollow);
    console.log("USER FOLLOWED", user);
    yield put(getUsersRequested());
    yield put(getUserByUsernameRequested(user.userName));
    // ✅ 🔄 Recharge les posts des abonnements (clé ici)
    yield put(
      getPostsByFollowingRequested({
        userId: action.payload.userId,
        skip: 0,
        limit: 5,
      })
    );
  } catch (error: any) {
    yield put(followUserFailed(error.message));
  }
}

// fonction pour ne plus suivre un utilisateur
// `action` est passé à `handleUnfollowUser`, qui contient le `userId` et `userIdToUnfollow`
// `userId` est l'utilisateur qui ne suit plus
// `userIdToUnfollow` est l'utilisateur à ne plus suivre
// `action.payload` contient les données nécessaires
// `action.payload.userId` est l'utilisateur qui ne suit plus
// `action.payload.userIdToUnfollow` est l'utilisateur à ne plus suivre
// `unFollowUser` est une fonction qui effectue la requête API pour ne plus suivre un utilisateur
function* handleUnfollowUser(
  action: PayloadAction<{ userId: string; userIdToUnfollow: string }>
): Generator<any, void, User> {
  try {
    const token = localStorage.getItem("accessToken");
    const unfollowedUser = yield call(
      unFollowUser,
      action.payload.userId,
      action.payload.userIdToUnfollow
    );

    yield put(unfollowUserSuccess(unfollowedUser));
    yield put(getUsersRequested());
    const user = yield call(getUser, action.payload.userIdToUnfollow);
    yield put(getUserByUsernameRequested(user.userName));
    // ✅ 🔄 Recharge les posts des abonnements (clé ici)
    yield put(
      getPostsByFollowingRequested({
        userId: action.payload.userId,
        skip: 0,
        limit: 5,
      })
    );
  } catch (error: any) {
    yield put(unfollowUserFailed(error.message));
  }
}

// Watcher saga : surveille les actions de type "GET_USER_REQUESTED" et appelle `getUser`
export default function* userSaga() {
  // `takeLatest` va écouter "GET_USER_REQUESTED" et appeler `getUser` avec l'action dispatchée
  yield takeLatest(getUserRequested.type, handleGetUser);
  yield takeLatest(updateUserRequested.type, handleUpdateUser);
  yield takeLatest(updatePictureRequested.type, handleUpdatePictureUser);
  yield takeLatest(removePictureRequested.type, handleRemovePictureUser);
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
