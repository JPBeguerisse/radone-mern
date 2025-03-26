import { Post, Comment } from "src/types/post.types";
import { User } from "src/types/user.types";
import { includesUser } from "src/utils/includesUser";

export const usePostStatus = (post: Post, userId: string) => {
  const isSaved = includesUser(post.savedBy, userId);
  const isLiked = includesUser(post.likers, userId);

  return {
    isSaved,
    isLiked,
  };
};

export const useCommentStatus = (
  comment: Comment | undefined,
  userId: string
) => {
  const isLiked = includesUser(comment?.likers, userId);

  return isLiked;
};

export const useUserRelations = (targetUser: User, currentUserId: string) => {
  const isFollowing = includesUser(targetUser.followers, currentUserId);
  const isFollowedBy = includesUser(targetUser.following, currentUserId); // si tu veux aussi ça

  return {
    isFollowing,
    isFollowedBy,
  };
};
