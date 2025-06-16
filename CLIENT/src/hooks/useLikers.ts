import { useQuery } from "@tanstack/react-query";
import { getLikers } from "src/services/posts/postService";
import { User } from "src/types/user.types";

export const useLikers = (postId: string) => {
  return useQuery<User[]>({
    // useQuery pour récupérer les likers d'un post
    queryKey: ["likers", postId], // Clé de cache unique pour les likers d'un post
    queryFn: () => getLikers(postId), // Fonction pour récupérer les likers depuis le service
    enabled: !!postId,
  });
};
