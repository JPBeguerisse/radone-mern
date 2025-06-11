import { Post } from "src/types/post.types";
import { User } from "src/types/user.types";
import { includesUser } from "src/utils/includesUser";

/**
 * Vérifie l'état d'un post par rapport à l'utilisateur courant.
 * @param post - Le post à analyser.
 * @param userId - L'ID de l'utilisateur courant.
 */
export const usePostStatus = (post: Post, userId: string) => {
  const isSaved = includesUser(post.savedBy, userId);
  const isLiked = includesUser(post.likers, userId);

  return {
    isSaved,
    isLiked,
  };
};

/**
 * Vérifie si l'utilisateur courant suit un autre utilisateur.
 * @param targetUser - L'utilisateur consulté.
 * @param currentUserId - L'ID de l'utilisateur courant.
 */
export const useUserRelations = (targetUser: User, currentUserId: string) => {
  const isFollowing = includesUser(targetUser.followers, currentUserId);

  return {
    isFollowing,
  };
};
