import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, UsersState } from "../types/user.types";

const initialState: UsersState = {
    users: [],
    error: null
};


const usersSlice = createSlice({
  name: "users",
  initialState, 
  reducers: {
    getUsersRequested : (state) => {},
    getUsersSuccess : (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
      state.error = null;
    },
    getUsersFailed : (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    }
  }
})

export const { getUsersRequested, getUsersFailed, getUsersSuccess} = usersSlice.actions;
export const usersReducer = usersSlice.reducer;


// export default function usersReducer(state = initialState, action: UsersActions) {
//   switch (action.type) {
//     case "GET_USERS_REQUESTED":
//       return {
//         ...state,
//       };

//     case "GET_USERS_SUCCESS":
//       return {
//         ...state,
//         users: action.payload,
//       };

//     case "GET_USERS_FAILED":
//       return {
//         ...state,
//         error: action.message,
//       };

//     default:
//       return state;
//   }
// }
