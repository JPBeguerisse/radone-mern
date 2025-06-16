import { combineReducers } from "redux";
import { usersReducer } from "./users.reducer";
import { postsReducer } from "./posts.reducer";
import { userReducer } from "./user.reducer";
import { viewedUserReducer } from "./viewed-user.reducer";
import { followingReducer } from "./following.reducer";
const rootReducers = combineReducers({
  usersReducer,
  postsReducer,
  userReducer,
  viewedUserReducer,
  //followingReducer,
});

export default rootReducers;
