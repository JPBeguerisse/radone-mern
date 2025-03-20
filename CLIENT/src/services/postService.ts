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

// Dislike une publication
export const dislikePost = async (
  id: string,
  userId: string
): Promise<Post> => {
  const response = await api.patch(`post/unlike/${id}`, { userId });
  return response.data;
};
