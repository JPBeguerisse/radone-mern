import axios, { AxiosResponse } from "axios";
import { put, takeLatest } from "redux-saga/effects";
import { Post } from "../types/post.types";
import { getPostsSuccess, getPostsFailed, getPostsRequested } from "../reducers/posts.reducer";

function* getPosts() {
    try {
        const response: AxiosResponse<Post[]> = yield axios.get("http://localhost:8000/api/post/");
        yield put (getPostsSuccess(response.data));
    } catch (error: any) {
        yield put(getPostsFailed(error.message))
    }
}

export default function* postsSaga(){
    yield takeLatest(getPostsRequested.type, getPosts);
}