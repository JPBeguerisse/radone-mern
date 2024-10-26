import { User } from "../actions/users/user";
import { UserActions } from "../actions/users/user.actions";

const initialState = {
    user: null as User | null,
    error: null as string | null
}

export default function userReducer(state = initialState, action: UserActions){
    switch(action.type) {
        case "GET_USER_REQUESTED": 
            return{
                ...state
            }
        
        case "GET_USER_SUCCESS":
            return {
                ...state,
                user: action.payload
            }

        case "GET_USER_FAILED":
            return {
                ...state,
                error: action.message
            }
        
        default:
            return state;
    }
}