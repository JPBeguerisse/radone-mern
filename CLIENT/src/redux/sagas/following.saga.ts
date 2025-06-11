import { PayloadAction } from "@reduxjs/toolkit";
import {
  getFollowingFailed,
  getFollowingRequested,
  getFollowingSuccess,
} from "../reducers/following.reducer";
import { getFollowing } from "src/services/userService";
import { call, put, takeLatest } from "redux-saga/effects";
import { FollowerUser } from "src/types/followers.types";

function* handleGetFollowing(
  action: PayloadAction<{
    userId: string;
    page: number;
    limit: number;
    search: string;
  }>
): Generator<any, void, FollowerUser[]> {
  try {
    const { userId, page, limit, search } = action.payload;
    const following = yield call(getFollowing, userId, page, limit, search);
    const hasMore = following.length === limit;
    yield put(getFollowingSuccess({ following, hasMore }));
  } catch (error: any) {
    yield put(getFollowingFailed(error.message));
  }
}

export function* followingSaga() {
  yield takeLatest(getFollowingRequested.type, handleGetFollowing);
}
