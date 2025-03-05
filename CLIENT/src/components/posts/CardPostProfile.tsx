import React, { useEffect, useState } from "react";
import { Post } from "../../redux/types/post.types";
import { useDispatch, useSelector } from "react-redux";
import {
  deletePostRequested,
  getPostRequested,
  getPostsRequested,
  updatePostRequested,
  updatePostSuccess,
} from "../../redux/reducers/posts.reducer";
import { PostModal } from "./PostModalView";

const CardProfile = () => {
  const userData = useSelector((state: any) => state.userReducer.user);
  const posts = useSelector((state: any) => state.postsReducer.posts);
  // const [selectedPost, setSelectedPost] = useState<Post>();
  const [isOpen, setIsOpen] = useState<boolean>();
  const selectedPost = useSelector((state: any) => state.postsReducer.post);

  // const selectedPost = useSelector((state: any) => state.postsReducer.post);

  console.log("Post sélectionné", selectedPost);
  // const [showOptions, setShowOptions] = useState<boolean>(false);
  const [editedMessage, setEditedMessage] = useState<string>("");
  const [editMode, setEditMode] = useState(false);
  const dispatch = useDispatch();

  // const openModal = (post: Post) => {
  //   const postSelect = dispatch(getPostRequested(post._id));
  //   console.log("DISPATCH POST", postSelect);
  //   setSelectedPost(post);
  //   setEditedMessage(post.message || "");
  //   console.log("POst modal ", post);
  // };

  const handleOpenModal = (post: Post) => {
    setIsOpen(true);
    const postSelect = dispatch(getPostRequested(post._id!));
    console.log("POST ", postSelect);
  };

  useEffect(() => {
    if (selectedPost) {
      setEditedMessage(selectedPost.message || ""); // ✅ Met à jour `editedMessage` quand Redux change
    }
  }, [selectedPost]);

  const closeModal = () => {
    // setShowOptions(false);
    setEditMode(false);
    setIsOpen(false);
  };

  const handleDelete = (id: string) => {
    dispatch(deletePostRequested(id));
  };
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
    <div className="flex flex-wrap gap-4 justify-center">
      {posts && posts.length > 0 && userData ? (
        posts.some((post: Post) => post.posterId === userData._id) ? (
          posts.map(
            (post: Post) =>
              post.posterId === userData._id && (
                <div
                  key={post._id}
                  onClick={() => handleOpenModal(post)}
                  className="cursor-pointer"
                >
                  <img
                    className="w-48 h-48 md:w-96 md:h-96 object-cover rounded-lg"
                    src={
                      post.picture
                        ? `${
                            process.env.REACT_APP_API_URL
                          }/${post.picture.replace(/^\//, "")}`
                        : undefined
                    }
                    alt="post-picture"
                  />
                </div>
              )
          )
        ) : (
          <p>Aucun post</p>
        )
      ) : (
        <p>Aucun post</p>
      )}

      {isOpen && selectedPost && (
        <PostModal
          post={selectedPost}
          isOpen={isOpen}
          onClose={closeModal}
          message={editedMessage}
          setEditedMessage={setEditedMessage}
          isEditing={editMode}
          setIsEditing={setEditMode}
          onSave={handleSave}
          onDelete={handleDelete}
          currentUser={userData}
        />
      )}

      {/* Modal */}
      {/* {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg max-w-sm md:max-w-lg w-full mx-4 relative">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={closeModal}
                className="text-gray-500 font-bold text-lg self-end"
              >
                X
              </button>
              <button
                className="text-gray-500 text-xl font-bold"
                onClick={() => setShowOptions(!showOptions)}
              >
                ...
              </button>
              {showOptions && (
                <div className="absolute right-4 top-12 bg-white border rounded shadow-lg">
                  <button
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      setEditMode(true);
                      setShowOptions(false);
                    }}
                  >
                    Modifier
                  </button>
                  <button
                    className="block px-4 py-2 text-red-500 hover:bg-gray-100"
                    onClick={handleDelete}
                  >
                    Supprimer
                  </button>
                </div>
              )}
            </div>

            <img
              className="w-full h-auto mb-4 rounded-lg"
              src={`${process.env.REACT_APP_API_URL}${
                selectedPost &&
                selectedPost.picture &&
                selectedPost.picture.replace(/^\//, "")
              }`}
              alt="Post"
            />
            <div className="text-sm md:text-base">
              {selectedPost && userData._id === selectedPost.posterId && (
                <p className="mb-2">
                  <strong>Posté par :</strong> {userData.firstName}{" "}
                  {userData.lastName}
                </p>
              )}
              <p className="mb-2">
                {editMode ? (
                  <textarea
                    value={editedMessage}
                    onChange={(e) => setEditedMessage(e.target.value)}
                    className="w-full p-2 border rounded mb-4"
                  />
                ) : (
                  <p>
                    <strong>Message :</strong>{" "}
                    {selectedPost && selectedPost.message}
                  </p>
                )}
                <div className="flex gap-4">
                  {editMode && (
                    <>
                      <button
                        onClick={() => setEditMode(false)}
                        className="px-4 py-2 border rounded"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-primary text-white rounded"
                      >
                        Enregistrer
                      </button>
                    </>
                  )}
                </div>
              </p>
              <p>
                <strong>Date :</strong> {selectedPost && selectedPost.createdAt}
              </p>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default CardProfile;
