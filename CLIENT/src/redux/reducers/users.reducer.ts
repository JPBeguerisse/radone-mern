import { UsersActions } from "../actions/users.actions";


const initialState = {
    users: [],
    error: null
};
export default function usersReducer(state = initialState, action: UsersActions) {
  switch (action.type) {
    case "GET_USERS_REQUESTED":
      return {
        ...state,
      };

    case "GET_USERS_SUCCESS":
      return {
        ...state,
        users: action.payload,
      };

    case "GET_USERS_FAILED":
      return {
        ...state,
        error: action.message,
      };

    default:
      return state;
  }
}
