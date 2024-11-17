import axios, { AxiosResponse } from "axios";
import { put, takeLatest } from "redux-saga/effects";
import { User } from "../types/user.types";

// `action` est passé à `getUser`, qui contient le `uid` dans `action.uid`
function* getUser(action: {uid: string; type: string}) {
    try {
        // Récupération du token depuis le localStorage
        const token = localStorage.getItem('accessToken');
        // Utilisation de `action.uid` pour obtenir l'utilisateur
        // Requête GET avec le token dans les headers pour l'authentification
        const response: AxiosResponse<User> = yield axios.get(`http://localhost:8000/api/user/${action.uid}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        );
        // Si la requête réussit, dispatch l'action de succès avec l'utilisateur récupéré
        yield put({type: "GET_USER_SUCCESS", payload: response.data});
    } catch (error: any) {
        // En cas d'erreur, dispatch une action d'échec avec le message d'erreur
        yield put ({ type: "GET_USER_FAILED", message: error.message});
    }
}


// Watcher saga : surveille les actions de type "GET_USER_REQUESTED" et appelle `getUser`
export default function* userSaga() {
    // `takeLatest` va écouter "GET_USER_REQUESTED" et appeler `getUser` avec l'action dispatchée
    yield takeLatest("GET_USER_REQUESTED", getUser);
}
