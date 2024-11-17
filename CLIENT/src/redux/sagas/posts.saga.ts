import axios, { AxiosResponse } from "axios";
import { put, takeLatest } from "redux-saga/effects";
import { Post } from "../types/post.types";

function* getPosts() {
    try {
        const response: AxiosResponse<Post[]> = yield axios.get("http://localhost:8000/api/post/");
        yield put ({type: "GET_POSTS_SUCCESS", payload: response.data});
    } catch (error: any) {
        yield put({type: "GET_POSTS_FAILED", message: error.message})
    }
}

export default function* postsSaga(){
    yield takeLatest("GET_POSTS_REQUESTED", getPosts);
}