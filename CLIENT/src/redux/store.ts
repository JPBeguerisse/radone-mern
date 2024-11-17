import rootSaga from './sagas';
import rootReducers from "./reducers";
import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { getPostsRequested } from './reducers/posts.reducer';
import { getUsersRequested } from './reducers/users.reducer';

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
store.dispatch(getUsersRequested());
store.dispatch(getPostsRequested());

export default store;
