const PostModel = require("../../models/post.model");
const logger = require("../../utils/logger");
const ObjectID = require("mongoose").Types.ObjectId;

// Ajouter un commentaire à un post
module.exports.addCommentPost = async (req, res) => {
  const postId = req.params.id;
  const { commenterId, text } = req.body;

  // Vérifier si l'ID du post et l'ID du commentateur sont valides
  if (!ObjectID.isValid(postId) || !ObjectID.isValid(commenterId)) {
    return res.status(400).send("ID(s) invalide(s)");
  }

  try {
    // Ajouter un commentaire dans le tableau comments du post
    const updatedPost = await PostModel.findByIdAndUpdate(
      postId,
      {
        $push: {
          // Utiliser $push pour ajouter un nouveau commentaire
          comments: {
            commenterId,
            text,
            timestamp: Date.now(),
          },
        },
      },
      { new: true }
    );

    updatedPost
      ? res.status(200).json(updatedPost)
      : res.status(404).send("Post non trouvé");
    logger.info(
      `✅ Commentaire ajouté au post avec ID ${postId} par l'utilisateur ${commenterId}`
    );
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de l'ajout du commentaire.",
    });
    logger.error(
      `❌ Erreur lors de l'ajout du commentaire au post avec ID ${postId} : ${error.message}`
    );
  }
};

// Modifier un commentaire
module.exports.updateComment = async (req, res) => {
  const postId = req.params.id;
  const { commentId, text } = req.body;

  if (!ObjectID.isValid(postId) || !ObjectID.isValid(commentId)) {
    return res.status(400).send("Invalid ID(s)");
  }

  try {
    const updaptedComment = await PostModel.findOneAndUpdate(
      { _id: postId, "comments._id": commentId }, // Chercher le post et le commentaire spécifique
      // Utiliser $set pour mettre à jour le texte et le timestamp du commentaire
      {
        "comments.$.commenterId": req.body.commenterId, // Assurez-vous que commenterId est dans le corps de la requête
      },
      {
        $set: {
          "comments.$.text": text,
          "comments.$.timestamp": Date.now(),
        },
      },
      { new: true }
    );

    updaptedComment
      ? res.status(200).json(updaptedComment)
      : res.status(404).send("Post ou commentaire non trouvé");
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la modification du commentaire.",
    });
    logger.error(
      `❌ Erreur lors de la modification du commentaire sur le post avec ID ${postId} : ${error.message}`
    );
  }
};

//Supprimer un commentaire
module.exports.deleteComment = async (req, res) => {
  const postId = req.params.id;
  const commentId = req.body.commentId;
  if (!ObjectID.isValid(postId) || !ObjectID.isValid(commentId)) {
    return res.status(400).send("ID(s) invalide(s)");
  }
  try {
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).send("Post non trouvé");
    }

    if (post.posterId.toString() !== req.userId) {
      return res
        .status(403)
        .send("Vous n'avez pas les droits pour supprimer ce commentaire.");
    }

    const deletedComment = await PostModel.findByIdAndUpdate(postId, {
      $pull: {
        // Utiliser $pull pour retirer le commentaire spécifique
        comments: { _id: commentId },
      },
    });

    deletedComment
      ? res.status(200).json(deletedComment)
      : res.status(404).send("Post ou commentaire non trouvé");
    logger.info(
      `✅ Commentaire avec ID ${commentId} supprimé du post avec ID ${postId} par l'utilisateur ${req.userId}`
    );
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression du commentaire.",
    });
    logger.error(
      `❌ Erreur lors de la suppression du commentaire sur le post avec ID ${postId} : ${error.message}`
    );
  }
};
