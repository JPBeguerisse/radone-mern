import { api } from "src/api/api";
import { Post } from "src/types/post.types";
import { LikersResponse, User } from "src/types/user.types";

export interface PostsFollowingResponse {
  posts: Post[];
  total: number;
}

export const createPost = async ({
  pictureUrl,
  publicId,
  message,
  posterId,
}: {
  pictureUrl?: string;
  publicId?: string;
  message: string;
  posterId: string;
}): Promise<Post> => {
  const response = await api.post("/post", {
    pictureUrl,
    publicId,
    message,
    posterId,
  });
  return response.data;
};

// Récupère les publications
// export const getPosts = async (): Promise<Post[]> => {
//   const response = await api.get("/post");
//   return response.data;
// };

export const getPosts = async (skip: number, limit = 5): Promise<Post[]> => {
  const response = await api.get(`/post?skip=${skip}&limit=${limit}`);
  return response.data;
};

// Récupère une publication par son id
export const getPost = async (id: string): Promise<Post> => {
  const response = await api.get(`/post/${id}`);
  return response.data;
};

// Récupère les posts des following d'un utilisateur
export const getPostsByFollowing = async (
  userId: string,
  skip: number,
  limit = 5
): Promise<PostsFollowingResponse> => {
  const response = await api.get(
    `/post/following/${userId}?skip=${skip}&limit=${limit}`
  );
  return response.data;
};

// Récupère les publications for you
export const getPostsForYou = async (
  userId: string,
  skip: number,
  limit = 5
): Promise<Post[]> => {
  const response = await api.get(
    `/post/for-you/${userId}?skip=${skip}&limit=${limit}`
  );
  return response.data;
};

// Récupère les publications d'un utilisateur par son nom d'utilisateur
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

/** Mettre à jour un post */
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
  const response = await api.put(`post/add-comment/${id}`, {
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
  await api.put(`/post/comment/delete/${postId}`, { commentId });
};

// Aimer une publication
export const addLikePost = async (id: string): Promise<Post> => {
  const response = await api.put(`post/like/${id}`);
  console.log("Post liked successfully");
  console.log("Response data:", response.data);
  return response.data;
};

// Unlike une publication
export const dislikePost = async (id: string): Promise<Post> => {
  const response = await api.put(`post/unlike/${id}`);
  console.log("Post unliked successfully");
  console.log("Response data:", response.data);
  return response.data;
};

//Aimer un commentaire
export const addLikeComment = async (
  postId: string,
  commentId: string
): Promise<Post> => {
  const response = await api.put(`post/comment/like/${postId}`, {
    commentId,
  });
  return response.data;
};

//Unliker un commentaire
export const unLikeComment = async (
  postId: string,
  commentId: string
): Promise<Post> => {
  const response = await api.put(`post/comment/unlike/${postId}`, {
    commentId,
  });
  return response.data;
};

//Ajouter un post aux favoris
export const savePost = async (
  postId: string,
  userId: string
): Promise<Post> => {
  const response = await api.put(`post/save/${postId}`, { userId });
  return response.data;
};

// Retirer un post des favoris
export const unSavePost = async (
  postId: string,
  userId: string
): Promise<Post> => {
  const response = await api.put(`post/unsave/${postId}`, { userId });
  return response.data;
};

// Récupérer les likers d'un post
// export const getLikers = async ({
//   postId,
//   page,
//   limit,
// }: {
//   postId: string;
//   page?: number;
//   limit?: number;
// }): Promise<LikersResponse[]> => {
//   const response = await api.get(`post/likers`, {
//     params: {
//       postId,
//       page: page || 1,
//       limit: limit || 5,
//     },
//   });
//   return response.data;
// };

export const getLikers = async (postId: string): Promise<User[]> => {
  const response = await api.get(`/post/likers/${postId}`);
  return response.data;
};
