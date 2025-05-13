import {
  QueryFunctionContext,
  QueryObserverResult,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import {
  FollowersResponse,
  FollowingResponse,
  getFollowers,
  getFollowing,
} from "src/services/userService";
import { User } from "src/types/user.types";

// export const useFollowers = (userId: string) => {
//   return useQuery<User[]>({
//     queryKey: ["followers", userId],
//     queryFn: () => getFollowers(userId),
//   });
// };

// export const useFollowing = (userId: string) => {
//   return useQuery<User[]>({
//     queryKey: ["following", userId],
//     queryFn: () => getFollowing(userId),
//   });
// };

export const useFollowers = (
  userId: string,
  limit: number = 5,
  search?: string
) => {
  return useInfiniteQuery<FollowersResponse>({
    queryKey: ["followers", userId, search],
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
    initialPageParam: 1, // ✅ Ajout de initialPageParam
  });
};

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
    initialPageParam: 1, // ✅ Ajout de initialPageParam
  });
};
