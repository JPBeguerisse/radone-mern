import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Post, PostsState } from "../types/post.types";


const initialState: PostsState = {
    posts: null,
    error: null
}

const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        getPostsRequested: (state)=> {},
        getPostsSuccess : (state, action: PayloadAction<Post[]>) => {
            state.posts = action.payload;
            state.error = null;
        },
        getPostsFailed : (state, action: PayloadAction<string>) => {
            state.error = action.payload;
        }
    }
})


export const { getPostsRequested, getPostsSuccess, getPostsFailed } = postsSlice.actions;
export const postsReducer = postsSlice.reducer;

// export default function postsReducer(state = initialState, action: PostsActions) {
//     switch(action.type){
//         case "GET_POSTS_REQUESTED":
//             return{
//                 ...state,
//             };

//         case "GET_POSTS_SUCCESS":
//             return{
//                 ...state,
//                 posts: action.payload
//             };
        
//         case "GET_POSTS_FAILED":
//             return {
//                 ...state,
//                 error: action.message
//             };
        
//         default:
//             return state
//     }
// }
