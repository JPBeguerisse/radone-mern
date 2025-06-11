import { PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { call, put } from "redux-saga/effects";
import {
  updatePostSuccess,
  getPostRequested,
  updatePostFailed,
  createPostSuccess,
  getPostsByFollowingRequested,
  createPostFailed,
  deletePostSuccess,
  deletePostFailed,
} from "src/redux/reducers/posts.reducer";
import { getPostsUserRequested } from "src/redux/reducers/user.reducer";
import {
  updatePost,
  createPost,
  deletePost,
} from "src/services/posts/postService";
import { Post } from "src/types/post.types";

let selectedFile: File | null = null;

export function setSelectedPicturePost(file: File | null) {
  selectedFile = file;
}

/** ✅ Saga pour modifier un post */
export function* handleUpdatePost(
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

// Fonction pour créer un post avec cloudinary
export function* handleCreatePost(
  action: PayloadAction<{
    message: string;
    posterId: string;
    pictureUrl?: string;
    publicId?: string;
  }>
): Generator<any, void, Post> {
  try {
    const { message, posterId, pictureUrl, publicId } = action.payload;

    // Appel de l'API pour créer le post
    const createdPost = yield call(createPost, {
      pictureUrl,
      publicId,
      message,
      posterId,
    });
    console.log("Post créé :", createdPost);
    yield put(createPostSuccess(createdPost));
    yield put(
      getPostsByFollowingRequested({ userId: posterId, skip: 0, limit: 5 })
    ); // Rafraîchir la liste des posts
    toast.success("Publication créée avec succès !");
  } catch (error: any) {
    toast.error(error.response?.data?.message || "Une erreur est survenue !");
    yield put(createPostFailed(error.message));
  }
}

// Fonction pour supprimer un post
export function* handleDeletePost(
  action: PayloadAction<{ postId: string; userId: string }>
): Generator<any, void, Post> {
  try {
    //appel api
    yield call(deletePost, action.payload.postId);
    //appel saga
    yield put(deletePostSuccess(action.payload.postId));
    yield put(getPostsUserRequested(action.payload.userId));
    yield put(
      getPostsByFollowingRequested({
        userId: action.payload.userId,
        skip: 0,
        limit: 5,
      })
    );
    toast.success("Post supprimé avec succès !");
  } catch (error: any) {
    toast.error(error.response?.data?.message || "Une erreur est survenue !");
    yield put(deletePostFailed(error.message));
    console.error("Erreur lors de la mise à jour du post :", error.message);
  }
}
