import rootSaga from './sagas';
import rootReducers from "./reducers";
import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";

const sagaMiddleware = createSagaMiddleware();
// mount it on the Store
// const store = createStore(userReducer, applyMiddleware(sagaMiddleware));
const store = configureStore({
  reducer: rootReducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware),
  devTools: true,
});

// then run the saga
sagaMiddleware.run(rootSaga);

//POUR DISPATCHER LES ACTIONS DES QUE L'APP SE LANCE
store.dispatch({ type: "GET_USERS_REQUESTED" });
store.dispatch({ type: "GET_POSTS_REQUESTED" });

export default store;
