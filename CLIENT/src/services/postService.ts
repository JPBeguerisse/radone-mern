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
