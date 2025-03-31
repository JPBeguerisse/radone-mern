//user.saga/ts
import axios, { AxiosResponse } from "axios";
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
} from "../reducers/user.reducer";
import { PayloadAction } from "@reduxjs/toolkit";
import {
  getUser,
  removePicture,
  updatePicture,
  updateUser,
} from "../../services/userService";
import { any } from "zod";
import { toast } from "react-toastify";

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

function* handleUpdatePictureUser(
  action: PayloadAction<{ userId: string; profileImage?: File }>
): Generator<any, void, User> {
  try {
    const formData = new FormData();
    formData.append("userId", action.payload.userId);
    formData.append("profileImage", action.payload.profileImage!);
    // console.log(action.payload);

    const updatedPicture = yield call(updatePicture, formData);
    yield put(updatePictureSuccess(updatedPicture));
    yield put(getUserRequested(action.payload.userId));
    toast.success("Votre photo de profil a été modifié.");
  } catch (error: any) {
    yield put(updateUserFailed(error.message));
    toast.error("Échec de la mise à jour de la photo de profil.");
  }
}

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

// Watcher saga : surveille les actions de type "GET_USER_REQUESTED" et appelle `getUser`
export default function* userSaga() {
  // `takeLatest` va écouter "GET_USER_REQUESTED" et appeler `getUser` avec l'action dispatchée
  yield takeLatest(getUserRequested.type, handleGetUser);
  yield takeLatest(updateUserRequested.type, handleUpdateUser);
  yield takeLatest(updatePictureRequested.type, handleUpdatePictureUser);
  yield takeLatest(removePictureRequested.type, handleRemovePictureUser);
}

// // `action` est passé à `getUser`, qui contient le `uid` dans `action.uid`
// function* getUser(action: {uid: string; type: string}) {
//     try {
//         // Récupération du token depuis le localStorage
//         const token = localStorage.getItem('accessToken');
//         // Utilisation de `action.uid` pour obtenir l'utilisateur
//         // Requête GET avec le token dans les headers pour l'authentification
//         const response: AxiosResponse<User> = yield axios.get(`http://localhost:8000/api/user/${action.uid}`,
//             {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 }
//             }
//         );
//         // Si la requête réussit, dispatch l'action de succès avec l'utilisateur récupéré
//         yield put({type: "GET_USER_SUCCESS", payload: response.data});
//     } catch (error: any) {
//         // En cas d'erreur, dispatch une action d'échec avec le message d'erreur
//         yield put ({ type: "GET_USER_FAILED", message: error.message});
//     }
// }

// // Watcher saga : surveille les actions de type "GET_USER_REQUESTED" et appelle `getUser`
// export default function* userSaga() {
//     // `takeLatest` va écouter "GET_USER_REQUESTED" et appeler `getUser` avec l'action dispatchée
//     yield takeLatest("GET_USER_REQUESTED", getUser);
// }
