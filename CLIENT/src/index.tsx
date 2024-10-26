import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from "react-redux";
import { configureStore } from '@reduxjs/toolkit';
import rootReducers from './reducers';
import createSagaMiddleware from 'redux-saga';
import { usersSaga } from './sagas/users'; 
import { postsSaga } from './sagas/posts';
import { userSaga } from './sagas/user';


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
sagaMiddleware.run(usersSaga);
sagaMiddleware.run(postsSaga);
sagaMiddleware.run(userSaga);

//POUR DISPATCHER LES ACTIONS DES QUE L'APP SE LANCE
store.dispatch({type: "GET_USERS_REQUESTED"});
store.dispatch({type: "GET_POSTS_REQUESTED"});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
// render the application
root.render(
  <Provider store={store}>
    <App/>
  </Provider>
)
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

