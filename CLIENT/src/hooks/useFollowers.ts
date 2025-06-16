// Hooks personnalisés pour récupérer les followers et following avec pagination et recherche
import {
  QueryFunctionContext,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import {
  FollowersResponse,
  FollowingResponse,
  getFollowers,
  getFollowing,
  getProfileFollowers,
  getProfileFollowing,
} from "src/services/userService";
import { User } from "src/types/user.types";

// Hook pour récupérer les abonnés (followers)
export const useFollowers = (
  userId: string,

  limit: number = 5,
  search?: string
) => {
  return useInfiniteQuery<FollowersResponse>({
    queryKey: ["followers", search], // Clé de cache unique
    queryFn: async ({ pageParam = 1 }: QueryFunctionContext) => {
      const page = pageParam as number;
      return await getFollowers(page, limit, search);
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
      return await getFollowing(page, limit, search);
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

export const useProfileFollowers = (userId: string) => {
  return useQuery<User[]>({
    queryKey: ["profileFollowers", userId],
    queryFn: () => getProfileFollowers(userId), // Récupère tous les followers
  });
};

// Hook pour récupérer les abonnements d'un profil
export const useProfileFollowing = (userId: string) => {
  return useQuery<User[]>({
    queryKey: ["profileFollowing", userId],
    queryFn: () => getProfileFollowing(userId), // Récupère tous les following
  });
};
