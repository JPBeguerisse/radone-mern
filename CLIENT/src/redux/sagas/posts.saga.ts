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
import { toast } from "react-toastify";

function* handleFetchPosts(): Generator<any, void, Post[]> {
  try {
    const posts = yield call(getPosts);
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
  action: PayloadAction<{ _id: string; data: Post }>
): Generator<any, void, Post> {
  try {
    const updatedPost: Post = yield call(
      updatePost,
      action.payload._id,
      action.payload.data
    );
    yield put(updatePostSuccess(updatedPost)); // ✅ Mise à jour locale du post
    yield put(getPostRequested(action.payload._id)); // ✅ Rafraîchissement du posts
    toast.success("Post modifié avec succès !");
  } catch (error: any) {
    toast.error(error.response?.data?.message || "Une erreur est survenue !");
    yield put(updatePostFailed(error.message));
    console.error("Erreur lors de la mise à jour du post :", error.message);
  }
}

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
    yield put(createPostSuccess(createdPost));
    yield put(getPostsRequested());
    toast.success("Publication créée avec succès !");
  } catch (error: any) {
    toast.error(error.response?.data?.message || "Une erreur est survenue !");
    yield put(createPostFailed(error.message));
  }
}

function* handleDeletePost(
  action: PayloadAction<string>
): Generator<any, void, Post> {
  try {
    //appel api
    yield call(deletePost, action.payload);
    //appel saga
    yield put(deletePostSuccess(action.payload));
    toast.success("Post supprimé avec succès !");
  } catch (error: any) {
    toast.error(error.response?.data?.message || "Une erreur est survenue !");
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
