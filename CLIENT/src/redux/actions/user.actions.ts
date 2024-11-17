import { User } from "../types/user.types";

export const GET_USER_REQUESTED = "GET_USER_REQUESTED";
export const GET_USER_SUCCESS = "GET_USER_SUCCESS";
export const GET_USER_FAILED = "GET_USER_FAILED";

interface GetUserAction {
  type: typeof GET_USER_REQUESTED;
}

interface GetUserSucessAction {
  type: typeof GET_USER_SUCCESS;
  payload: User;
}

interface GetUserFailedAction {
  type: typeof GET_USER_FAILED;
  message: string;
}


export type UserActions = GetUserAction | GetUserSucessAction | GetUserFailedAction;