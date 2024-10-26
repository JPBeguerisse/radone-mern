import { GET_USERS_SUCCESS } from "../users/users.actions";
import { Post } from "./post.interface";

export const GET_POSTS_REQUESTED = "GET_POSTS_REQUESTED";
export const GET_POSTS_SUCCESS = "GET_POSTS_SUCCESS";
export const GET_POSTS_FAILED = "GET_POSTS_FAILED";

interface GetPostsAction {
    type: typeof GET_POSTS_REQUESTED;
}
 
interface GetPostsSucessAction {
    type: typeof GET_POSTS_SUCCESS,
    payload: Post[];
}

interface GetPostsFailedAction {
    type: typeof GET_POSTS_FAILED,
    message: string
}

export type PostsActions = 
    GetPostsAction 
    | GetPostsSucessAction 
    | GetPostsFailedAction
;