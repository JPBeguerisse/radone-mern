import { Heart, MessageCircle } from "lucide-react";
import React, { useContext } from "react";
import { Post } from "src/types/post.types";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { current } from "@reduxjs/toolkit";
import UserContext from "../AppContext";
import { useDispatch } from "react-redux";
import {
  disLikePostRequested,
  likePostRequested,
} from "src/redux/reducers/posts.reducer";
import { dislikePost } from "src/services/postService";

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
  const currentUserUid = useContext(UserContext)?.toString();
  const dispatch = useDispatch();

  return (
    <div>
      <div className="flex gap-2 mt-4">
        {currentUserUid && post.likers?.includes(currentUserUid.toString()) ? (
          <button
            onClick={() =>
              dispatch(
                disLikePostRequested({
                  postId: post._id!,
                  userId: currentUserUid!,
                })
              )
            }
          >
            <Heart
              className="text-red-500 "
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
      <div className="mt-2">
        <p>6880 J'aime</p>
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
