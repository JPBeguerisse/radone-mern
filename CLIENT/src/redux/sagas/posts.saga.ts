import axios, { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Post } from "../types/post.types";
import {
  getPostsSuccess,
  getPostsFailed,
  getPostsRequested,
  updatePostSuccess,
  updatePostRequested,
  getPostSuccess,
  getPostRequested,
  updatePostFailed,
  deletePostRequested,
  deletePostFailed,
  deletePostSuccess,
  createPostSuccess,
  createPostRequested,
  createPostFailed,
} from "../reducers/posts.reducer";
import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  updatePost,
} from "../../services/postService";
import { PayloadAction } from "@reduxjs/toolkit";

function* handleFetchPosts(): Generator<any, void, Post[]> {
  try {
    const posts = yield call(getPosts);
    //console.log("POSTSSS", posts);
    yield put(getPostsSuccess(posts));
  } catch (error: any) {
    yield put(getPostsFailed(error.message));
  }
}

function* handleFetchPost(
  action: PayloadAction<string>
): Generator<any, void, Post> {
  try {
    const post = yield call(getPost, action.payload);
    yield put(getPostSuccess(post));
  } catch (error: any) {
    yield put(getPostsFailed(error.message));
  }
}

/** ✅ Saga pour modifier un post */
function* handleUpdatePost(
  action: PayloadAction<{ id: string; data: Post }>
): Generator<any, void, Post> {
  try {
    const updatedPost: Post = yield call(
      updatePost,
      action.payload.id,
      action.payload.data
    );

    yield put(updatePostSuccess(updatedPost)); // ✅ Mise à jour locale du post
    yield put(getPostRequested(action.payload.id)); // ✅ Rafraîchissement du posts
  } catch (error: any) {
    yield put(updatePostFailed(error.message));
    console.error("Erreur lors de la mise à jour du post :", error.message);
  }
}

// function* handleCreatePost(
//   action: PayloadAction<FormData>
// ): Generator<any, void, Post> {
//   try {
//     console.log("POST SAGA", action.payload);
//     const createdPost = yield call(createPost, action.payload);
//     yield put(createPostSuccess(createdPost));
//     yield put(getPostsRequested());
//   } catch (error: any) {
//     console.error("Erreur lors de la création du post :", error.message);
//   }
// }

function* handleCreatePost(
  action: PayloadAction<{ message: string; posterId: string; postImage?: File }>
): Generator<any, void, Post> {
  try {
    const formData = new FormData();
    formData.append("posterId", action.payload.posterId);
    formData.append("message", action.payload.message);
    if (action.payload.postImage) {
      formData.append("postImage", action.payload.postImage);
    }

    const createdPost = yield call(createPost, formData);
    console.log("CREATED", createdPost);
    yield put(createPostSuccess(createdPost));
    yield put(getPostsRequested());
  } catch (error: any) {
    yield put(createPostFailed(error.message));
  }
}

function* handleDeletePost(
  action: PayloadAction<string>
): Generator<any, void, Post> {
  try {
    //appel api
    console.log("ID to delete", action.payload);
    yield call(deletePost, action.payload);
    //appel saga
    yield put(deletePostSuccess(action.payload));
  } catch (error: any) {
    yield put(deletePostFailed(error.message));
    console.error("Erreur lors de la mise à jour du post :", error.message);
  }
}

export default function* postsSaga() {
  yield takeLatest(getPostsRequested.type, handleFetchPosts);
  yield takeLatest(updatePostRequested.type, handleUpdatePost);
  yield takeLatest(getPostRequested.type, handleFetchPost);
  yield takeLatest(deletePostRequested.type, handleDeletePost);
  yield takeLatest(createPostRequested.type, handleCreatePost);
}

// function* getPosts() {
//     try {
//         const response: AxiosResponse<Post[]> = yield axios.get("http://localhost:8000/api/post/");
//         yield put (getPostsSuccess(response.data));
//     } catch (error: any) {
//         yield put(getPostsFailed(error.message))
//     }
// }
