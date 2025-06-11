import { PayloadAction } from "@reduxjs/toolkit";
import { call, put } from "redux-saga/effects";
import { getUserSuccess, getUserFailed } from "src/redux/reducers/user.reducer";
import { getUser } from "src/services/userService";
import { User } from "src/types/user.types";

/**
 * Saga pour récupérer les données d'un utilisateur à partir de son ID
 * @param action - contient l'ID de l'utilisateur à récupérer
 */
export function* handleGetUser(
  action: PayloadAction<string>
): Generator<any, void, User> {
  try {
    // Appel de l'API pour récupérer l'utilisateur par son ID
    const user = yield call(getUser, action.payload);

    // Mise à jour du store avec les données récupérées
    yield put(getUserSuccess(user));
  } catch (error: any) {
    // Gestion de l'erreur : envoie du message d'erreur au reducer
    yield put(getUserFailed(error.message));
  }
}
