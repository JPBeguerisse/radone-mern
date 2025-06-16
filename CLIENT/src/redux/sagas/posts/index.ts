import { takeLatest } from "redux-saga/effects";
import {
  getPostsRequested,
  updatePostRequested,
  getPostRequested,
  deletePostRequested,
  createPostRequested,
  createCommentRequested,
  deleteCommentRequested,
  likePostRequested,
  unLikePostRequested,
  likeCommentRequested,
  unLikeCommentRequested,
  unSavePostRequested,
  savePostRequested,
  getPostsByFollowingRequested,
  getPostsForYouRequested,
} from "../../reducers/posts.reducer";
import {
  handleFetchPost,
  handleFetchPosts,
  handleFetchPostsFollowing,
  handleFetchPostsForYou,
} from "./fetchPots.saga";
import { handleAddComment, handleDeleteComment } from "./comments.saga";
import {
  handleLikeComment,
  handleLikePost,
  handleUnLikeComment,
  handleUnLikePost,
} from "./likes.saga";
import { handleSavePost, handleUnSavePost } from "./save.saga";
import {
  handleUpdatePost,
  handleDeletePost,
  handleCreatePost,
} from "./posts.saga";

export default function* postsSaga() {
  yield takeLatest(getPostsRequested.type, handleFetchPosts);
  yield takeLatest(updatePostRequested.type, handleUpdatePost);
  yield takeLatest(getPostRequested.type, handleFetchPost);
  yield takeLatest(deletePostRequested.type, handleDeletePost);
  yield takeLatest(createPostRequested.type, handleCreatePost);
  yield takeLatest(createCommentRequested.type, handleAddComment);
  yield takeLatest(deleteCommentRequested.type, handleDeleteComment);
  yield takeLatest(likePostRequested.type, handleLikePost);
  yield takeLatest(unLikePostRequested.type, handleUnLikePost);
  yield takeLatest(likeCommentRequested.type, handleLikeComment);
  yield takeLatest(unLikeCommentRequested.type, handleUnLikeComment);
  yield takeLatest(savePostRequested.type, handleSavePost);
  yield takeLatest(unSavePostRequested.type, handleUnSavePost);
  yield takeLatest(
    getPostsByFollowingRequested.type,
    handleFetchPostsFollowing
  );
  yield takeLatest(getPostsForYouRequested.type, handleFetchPostsForYou);
}
