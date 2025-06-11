// Hooks personnalisés pour récupérer les followers et following avec pagination et recherche
import { QueryFunctionContext, useInfiniteQuery } from "@tanstack/react-query";
import {
  FollowersResponse,
  FollowingResponse,
  getFollowers,
  getFollowing,
} from "src/services/userService";

// Hook pour récupérer les abonnés (followers)
export const useFollowers = (
  userId: string,
  limit: number = 5,
  search?: string
) => {
  return useInfiniteQuery<FollowersResponse>({
    queryKey: ["followers", userId, search], // Clé de cache unique
    queryFn: async ({ pageParam = 1 }: QueryFunctionContext) => {
      const page = pageParam as number;
      return await getFollowers(userId, page, limit, search);
    },
    getNextPageParam: (
      lastPage: FollowersResponse,
      allPages: FollowersResponse[]
    ) => {
      const totalFetched = allPages.flatMap((page) => page.followers).length;
      return totalFetched < lastPage.total ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1, // Page initiale
  });
};

// Hook pour récupérer les abonnements (following)
export const useFollowing = (
  userId: string,
  limit: number = 5,
  search?: string
) => {
  return useInfiniteQuery<FollowingResponse>({
    queryKey: ["following", userId, search],
    queryFn: async ({ pageParam = 1 }: QueryFunctionContext) => {
      const page = pageParam as number;
      return await getFollowing(userId, page, limit, search);
    },
    getNextPageParam: (
      lastPage: FollowingResponse,
      allPages: FollowingResponse[]
    ) => {
      const totalFetched = allPages.flatMap((page) => page.following).length;
      return totalFetched < lastPage.total ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });
};
