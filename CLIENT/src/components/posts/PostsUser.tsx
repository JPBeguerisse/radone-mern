import React, { useEffect, useState } from "react";
import { Post } from "../../types/post.types";
import { useDispatch, useSelector } from "react-redux";
import {
  deletePostRequested,
  getPostRequested,
  getPostsRequested,
  updatePostRequested,
  updatePostSuccess,
} from "../../redux/reducers/posts.reducer";
import { PostView } from "./PostView";
import { Card } from "./Card";

export const PostsUser = () => {
  const userData = useSelector((state: any) => state.userReducer.user);
  const posts = useSelector((state: any) => state.postsReducer.posts);
  const [isOpen, setIsOpen] = useState<boolean>();
  const selectedPost = useSelector((state: any) => state.postsReducer.post);

  //console.log("Post sélectionné", selectedPost);
  const [editedMessage, setEditedMessage] = useState<string>("");
  const [editMode, setEditMode] = useState(false);
  const dispatch = useDispatch();

  const handleOpenModal = (post: Post) => {
    setIsOpen(true);
    const postSelect = dispatch(getPostRequested(post._id!));
    //console.log("POST ", postSelect);
  };

  useEffect(() => {
    if (selectedPost) {
      setEditedMessage(selectedPost.message || ""); // ✅ Met à jour `editedMessage` quand Redux change
    }
  }, [selectedPost]);

  const closeModal = () => {
    setEditMode(false);
    setIsOpen(false);
  };

  // const handleDelete = (id: string) => {
  //   dispatch(deletePostRequested(id));
  // };

  const handleSave = () => {
    try {
      const updatedData = { message: editedMessage };
      dispatch(
        updatePostRequested({ _id: selectedPost?._id, data: updatedData })
      );
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour du post :", error.message);
    }
    setEditMode(false);
  };

  return (
    <div className="flex flex-wrap gap-0.5 justify-center">
      {posts && posts.length > 0 && userData ? (
        posts.some((post: Post) => post.posterId === userData._id) ? (
          posts.map(
            (post: Post) =>
              post.posterId === userData._id && (
                <Card key={post._id} post={post} onOpen={handleOpenModal} />
              )
          )
        ) : (
          <p>Aucun post</p>
        )
      ) : (
        <p>Aucun post</p>
      )}

      {isOpen && selectedPost && (
        <PostView
          post={selectedPost}
          isOpen={isOpen}
          onClose={closeModal}
          message={editedMessage}
          setEditedMessage={setEditedMessage}
          isEditing={editMode}
          setIsEditing={setEditMode}
          onSave={handleSave}
        />
      )}
    </div>
  );
};
