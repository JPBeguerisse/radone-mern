import { PostsActions } from "../actions/posts.action";

const initialState = {
    posts: [],
    error: null
}

export default function postsReducer(state = initialState, action: PostsActions) {
    switch(action.type){
        case "GET_POSTS_REQUESTED":
            return{
                ...state,
            };

        case "GET_POSTS_SUCCESS":
            return{
                ...state,
                posts: action.payload
            };
        
        case "GET_POSTS_FAILED":
            return {
                ...state,
                error: action.message
            };
        
        default:
            return state
    }
}
