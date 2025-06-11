import { call, put } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import {
  getPostsSuccess,
  getPostsFailed,
  getPostSuccess,
  getPostRequested,
  getPostsByFollowingSuccess,
  getPostsByFollowingFailed,
  getPostsForYouSuccess,
  getPostsRequested,
} from "src/redux/reducers/posts.reducer";

import { Post } from "src/types/post.types";

import {
  getPosts,
  getPost,
  getPostsForYou,
  getPostsByFollowing,
} from "src/services/posts/postService";

// 🔄 Saga - Récupération des posts généraux
export function* handleFetchPosts(
  action: PayloadAction<{ skip: number; limit: number }>
): Generator<any, void, Post[]> {
  try {
    const { skip, limit } = action.payload;
    const posts = yield call(getPosts, skip, limit);
    yield put(getPostsSuccess(posts));
  } catch (error: any) {
    yield put(getPostsFailed(error.message));
  }
}

// 🔄 Saga - Récupération d'un post unique
export function* handleFetchPost(
  action: PayloadAction<string>
): Generator<any, void, Post> {
  try {
    const post = yield call(getPost, action.payload);
    yield put(getPostSuccess(post));
  } catch (error: any) {
    yield put(getPostsFailed(error.message));
  }
}

// 🔄 Saga - Récupération des posts des followings
export function* handleFetchPostsFollowing(
  action: PayloadAction<{ userId: string; skip: number; limit: number }>
): Generator<any, void, Post[]> {
  try {
    const { userId, skip, limit } = action.payload;
    const followingPosts = yield call(getPostsByFollowing, userId, skip, limit);
    yield put(
      getPostsByFollowingSuccess({
        followingPosts,
        hasMore: followingPosts.length === limit,
        skip,
      })
    );
  } catch (error: any) {
    yield put(getPostsByFollowingFailed(error.message));
  }
}

// 🔄 Saga - Récupération des posts "For You"
export function* handleFetchPostsForYou(
  action: PayloadAction<{ userId: string; skip: number; limit: number }>
): Generator<any, void, Post[]> {
  try {
    const { userId, skip, limit } = action.payload;
    const forYouPosts = yield call(getPostsForYou, userId, skip, limit);
    yield put(
      getPostsForYouSuccess({
        forYouPosts,
        hasMore: forYouPosts.length === limit,
      })
    );
  } catch (error: any) {
    yield put(getPostsFailed(error.message));
  }
}
