import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, UsersState } from "../../types/user.types";

const initialState: UsersState = {
  users: [],
  error: null,
};

const usersSlice = createSlice({
  name: "Users",
  initialState,
  reducers: {
    getUsersRequested: (state) => {},
    getUsersSuccess: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
      state.error = null;
    },
    getUsersFailed: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const { getUsersRequested, getUsersFailed, getUsersSuccess } =
  usersSlice.actions;
export const usersReducer = usersSlice.reducer;
