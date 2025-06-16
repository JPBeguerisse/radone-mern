import { call, put } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
  deleteProfilePicture,
  removePicture,
  updatePicture,
  updateUser,
} from "src/services/userService";

import { UpdateUserPayload, User } from "src/types/user.types";
import {
  updateUserSuccess,
  updateUserFailed,
  getUserRequested,
  updateProfilePictureFailed,
  updateProfilePictureSuccess,
  removeProfilePictureSuccess,
  removePictureSuccess,
} from "src/redux/reducers/user.reducer";
import { getUsersRequested } from "src/redux/reducers/users.reducer";

let selectedFile: File | null = null;

export function setSelectedPicture(file: File | null) {
  selectedFile = file;
}

/**
 * Saga pour mettre à jour les informations d’un utilisateur
 * @param action - contient l'ID de l'utilisateur et les nouvelles données à appliquer
 */
export function* handleUpdateUser(
  action: PayloadAction<{ id: string; data: UpdateUserPayload }>
): Generator<any, void, User> {
  try {
    // Appel API pour mettre à jour l'utilisateur
    const updatedUser = yield call(
      updateUser,
      action.payload.id,
      action.payload.data
    );

    // Mise à jour du store avec le nouvel utilisateur
    yield put(updateUserSuccess(updatedUser));
    yield put(getUsersRequested());

    // Notification succès
    toast.success("Profil mis à jour avec succès !");
  } catch (error: any) {
    const response = error?.response?.data;

    // Si erreurs de validation détaillées
    if (response?.errors) {
      yield put(updateUserFailed(response.errors)); // champs invalides
    } else {
      yield put(updateUserFailed(response?.message || "Erreur serveur"));
    }

    // Notification erreur
    toast.error("Échec de la mise à jour du profil.");
  }
}

/**
 * Saga pour mettre à jour la photo de profil d’un utilisateur (via Cloudinary)
 * @param action - contient l'ID utilisateur, l'URL de la nouvelle image, et le public_id Cloudinary
 */
export function* handleUpdateProfilePicture(
  action: PayloadAction<{
    userId: string;
    pictureUrl: string;
    public_id: string;
  }>
): Generator<any, void, User> {
  try {
    const { userId, pictureUrl, public_id } = action.payload;

    // Appel API pour mettre à jour la photo de profil
    const updatedPicture = yield call(
      updatePicture,
      userId,
      pictureUrl,
      public_id
    );

    // Mise à jour du store avec le nouvel utilisateur
    yield put(updateProfilePictureSuccess(updatedPicture));
    yield put(getUserRequested(userId)); // Rafraîchit les infos utilisateur

    toast.success("Votre photo de profil a été modifiée.");
  } catch (error: any) {
    yield put(updateProfilePictureFailed(error.message));
    toast.error("Échec de la mise à jour de la photo de profil.");
  }
}

/**
 * Saga pour supprimer la photo de profil d’un utilisateur (Cloudinary)
 * @param action - contient l'ID de l'utilisateur
 */
export function* handleRemoveProfilePicture(
  action: PayloadAction<string>
): Generator<any, void, User> {
  try {
    // Appel API pour supprimer la photo de profil
    const removedPicture = yield call(deleteProfilePicture, action.payload);

    // Mise à jour du state avec succès
    yield put(removeProfilePictureSuccess(removedPicture));

    // Rafraîchit les infos de l'utilisateur
    yield put(getUserRequested(action.payload));

    toast.success("Votre photo de profil a été supprimée.");
  } catch (error: any) {
    yield put(updateUserFailed(error.message));
    toast.error("Échec de la suppression de la photo de profil.");
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
