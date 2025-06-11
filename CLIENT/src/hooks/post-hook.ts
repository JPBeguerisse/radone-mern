// Hook personnalisé pour récupérer les posts des utilisateurs suivis avec pagination
import { QueryFunctionContext, useInfiniteQuery } from "@tanstack/react-query";
import {
  getPostsByFollowing,
  PostsFollowingResponse,
} from "src/services/posts/postService";
export const useFollowingPosts = (userId: string, limit: number = 5) => {
  return useInfiniteQuery<PostsFollowingResponse>({
    // Clé unique pour ce hook
    queryKey: ["followingPosts", userId],

    // Fonction qui appelle l'API avec la pagination
    queryFn: async ({ pageParam = 0 }: QueryFunctionContext) => {
      const page = pageParam as number;
      return await getPostsByFollowing(userId, page, limit);
    },

    // Détermine la page suivante à charger (pagination)
    getNextPageParam: (
      lastPage: PostsFollowingResponse,
      allPages: PostsFollowingResponse[]
    ) => {
      const totalLoaded = allPages.flatMap((page) => page.posts).length;
      return totalLoaded < lastPage.total ? totalLoaded : undefined;
    },

    // Paramètre initial de pagination
    initialPageParam: 0,
  });
};
