import { combineReducers } from "redux";
import usersReducer from "./users.reducer";
import postsReducer from "./posts.reducer";
import userReducer from "./user.reducer";

const rootReducers = combineReducers({
    usersReducer,
    postsReducer,
    userReducer
})

export default rootReducers;