import { Album, Bookmark, Heart, MessageCircle } from "lucide-react";
import React, { useContext } from "react";
import { Post } from "src/types/post.types";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { current } from "@reduxjs/toolkit";
import UserContext from "../AppContext";
import { useDispatch } from "react-redux";
import {
  unLikePostRequested,
  likePostRequested,
  savePostRequested,
  unSavePostRequested,
} from "src/redux/reducers/posts.reducer";
import { usePostStatus } from "src/hooks/usePostStatus";

interface PostButtonActionProps {
  showComments: boolean;
  onToggleComments: (value: boolean) => void;
  post: Post;
  isMobile?: boolean;
}

const PostButtonAction: React.FC<PostButtonActionProps> = ({
  showComments,
  onToggleComments,
  post,
  isMobile,
}) => {
  const userContext = useContext(UserContext);
  const currentUserUid = userContext?.uid;
  const dispatch = useDispatch();

  // Fonction utilitaire qui vérifie si l'utilisateur a enregistré le post
  // const isPostSaved = (post: Post, userId: string): boolean => {
  //   if (!post.savedBy) return false;
  //   if (typeof post.savedBy[0] === "string") {
  //     return post.savedBy.includes(userId);
  //   }
  //   return post.savedBy.some((user: any) => user._id === userId);
  // };

  // const isPostLiked = (post: Post, userId: string): boolean => {
  //   if (!post.likers) return false;
  //   if (typeof post.likers[0] === "string") {
  //     return post.likers.includes(userId);
  //   }
  //   return post.likers.some((user: any) => user._id === userId);
  // };

  const { isLiked } = usePostStatus(post, currentUserUid!);
  const { isSaved } = usePostStatus(post, currentUserUid!);
  return (
    <div>
      <div className="flex justify-between">
        <div className="flex gap-2 mt-4">
          {isLiked ? (
            <button
              onClick={() =>
                dispatch(
                  unLikePostRequested({
                    postId: post._id!,
                    userId: currentUserUid!,
                  })
                )
              }
            >
              <Heart
                className="text-red-500 transition-all duration-200 ease-in-out"
                width={30}
                height={30}
                fill="currentColor"
              />
            </button>
          ) : (
            <button
              onClick={() =>
                dispatch(
                  likePostRequested({
                    postId: post._id!,
                    userId: currentUserUid!,
                  })
                )
              }
            >
              <Heart width={30} height={30} />
            </button>
          )}
          <button onClick={() => onToggleComments(!showComments)}>
            <MessageCircle width={30} height={30} />
          </button>
        </div>
        {isSaved ? (
          <div className="flex gap-2 mt-4">
            <Bookmark
              className="cursor-pointer text-black-500 transition-all duration-200 ease-in-out"
              width={30}
              height={30}
              fill="currentColor"
              onClick={() =>
                dispatch(
                  unSavePostRequested({
                    postId: post._id!,
                    userId: currentUserUid!,
                  })
                )
              }
            />
          </div>
        ) : (
          <div className="flex gap-2 mt-4">
            <Bookmark
              className="cursor-pointer"
              width={30}
              height={30}
              onClick={() =>
                dispatch(
                  savePostRequested({
                    postId: post._id!,
                    userId: currentUserUid!,
                  })
                )
              }
            />
          </div>
        )}
      </div>
      <div className="mt-2">
        {post.likers?.length && post.likers?.length > 0 ? (
          <p>{post.likers?.length} J'aime</p>
        ) : null}
        {isMobile && post.comments?.length! > 0 && (
          <p
            onClick={() => onToggleComments(!showComments)}
            className="text-gray-400 text-sm"
          >
            Afficher les {post.comments?.length} commentaires
          </p>
        )}
        <p className="text-gray-400 text-sm">
          {format(new Date(post.createdAt!), "dd MMMM yyyy", {
            locale: fr,
          })}
        </p>
      </div>
    </div>
  );
};

export default PostButtonAction;
