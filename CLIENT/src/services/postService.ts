import { Post } from "src/types/post.types";
import { api } from "../api/api";

//creation de post
export const createPost = async (formData: FormData) => {
  console.log(
    "Données envoyées à l'API :",
    Object.fromEntries(formData.entries())
  );

  const response = await api.post("/post", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  console.log("Réponse de l'API :", response);

  return response.data; //
};

// Récupère les publications
export const getPosts = async (): Promise<Post[]> => {
  const response = await api.get("/post");
  return response.data;
};

// Récupère les publications
export const getPost = async (id: string): Promise<Post> => {
  const response = await api.get(`/post/${id}`);
  return response.data;
};

// Récupère les publications d'un utilisateur
export const getPostsByUser = async (username: string): Promise<Post[]> => {
  const response = await api.get(`/post/user/${username}`);
  return response.data;
};

// Récupère les publications d'un utilisateur par son id
export const getPostsByUserId = async (userId: string): Promise<Post[]> => {
  const response = await api.get(`/post/user-profil/${userId}`);
  return response.data;
};

// Récupère les publications sauvegardées
export const getSavedPostsByUser = async (userId: string): Promise<Post[]> => {
  const response = await api.get(`/post/saved/${userId}`);
  return response.data;
};

/** ⚙️ Mettre à jour un post */
export const updatePost = async (
  id: string,
  updatedData: Post
): Promise<Post> => {
  const response = await api.put(`/post/${id}`, updatedData);
  return response.data;
};

// Supprime une publication
export const deletePost = async (id: string): Promise<void> => {
  await api.delete(`/post/${id}`);
  console.log("Post delete avec success");
};

//Ajouter un commentaire
export const addCommentPost = async (
  id: string,
  commenterId: string,
  text: string
): Promise<Post> => {
  const response = await api.patch(`post/add-comment/${id}`, {
    commenterId,
    text,
  });
  return response.data;
};

//Supprimer un commentaire
export const deleteCommentPost = async (
  postId: string,
  commentId: string
): Promise<void> => {
  console.log("Données envoyées :", { postId, commentId });
  await api.patch(`/post/comment/delete/${postId}`, { commentId });
};

// Aimer une publication
export const addLikePost = async (
  id: string,
  userId: string
): Promise<Post> => {
  const response = await api.patch(`post/like/${id}`, { userId });
  return response.data;
};

// Unlike une publication
export const dislikePost = async (
  id: string,
  userId: string
): Promise<Post> => {
  const response = await api.patch(`post/unlike/${id}`, { userId });
  return response.data;
};

//Aimer un commentaire
export const addLikeComment = async (
  postId: string,
  commentId: string,
  userId: string
): Promise<Post> => {
  const response = await api.patch(`post/comment/like/${postId}`, {
    commentId,
    userId,
  });
  return response.data;
};

//Unliker un commentaire
export const unLikeComment = async (
  postId: string,
  commentId: string,
  userId: string
): Promise<Post> => {
  const response = await api.patch(`post/comment/unlike/${postId}`, {
    commentId,
    userId,
  });
  return response.data;
};

//Ajouter un post aux favoris
export const savePost = async (
  postId: string,
  userId: string
): Promise<Post> => {
  const response = await api.patch(`post/save/${postId}`, { userId });
  return response.data;
};

// Retirer un post des favoris
export const unSavePost = async (
  postId: string,
  userId: string
): Promise<Post> => {
  const response = await api.patch(`post/unsave/${postId}`, { userId });
  return response.data;
};
