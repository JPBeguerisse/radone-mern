import axios, { AxiosResponse } from "axios";
import { Post } from "../actions/posts/post.interface";
import { put, takeLatest } from "redux-saga/effects";

function* getPosts() {
    try {
        const response: AxiosResponse<Post[]> = yield axios.get("http://localhost:8000/api/post/");
        yield put ({type: "GET_POSTS_SUCCESS", payload: response.data});
    } catch (error: any) {
        yield put({type: "GET_POSTS_FAILED", message: error.message})
    }
}

export function* postsSaga(){
    yield takeLatest("GET_POSTS_REQUESTED", getPosts);
}