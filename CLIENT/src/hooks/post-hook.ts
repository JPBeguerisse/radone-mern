import { QueryFunctionContext, useInfiniteQuery } from "@tanstack/react-query";
import {
  getPostsByFollowing,
  PostsFollowingResponse,
} from "src/services/postService";

export const useFollowingPosts = (userId: string, limit: number = 5) => {
  return useInfiniteQuery<PostsFollowingResponse>({
    queryKey: ["followingPosts", userId],
    queryFn: async ({ pageParam = 0 }: QueryFunctionContext) => {
      const page = pageParam as number;
      return await getPostsByFollowing(userId, page, limit);
    },
    getNextPageParam: (
      lastPage: PostsFollowingResponse,
      allPages: PostsFollowingResponse[]
    ) => {
      const totalLoaded = allPages.flatMap((page) => page.posts).length;
      return totalLoaded < lastPage.total ? totalLoaded : undefined;
    },
    initialPageParam: 0,
  });
};
