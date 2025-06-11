const PostModel = require("../../models/post.model");
const ObjectID = require("mongoose").Types.ObjectId;

//Liker un comment
module.exports.addLikeComment = async (req, res) => {
  const postId = req.params.id;
  const { commentId } = req.body;

  if (!ObjectID.isValid(postId)) return res.status(400).send("Post ID inconnu");
  if (!ObjectID.isValid(commentId))
    return res.status(400).send("Comment ID inconnu");

  try {
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).send("Post non trouvé");
    }

    const result = await PostModel.findOneAndUpdate(
      {
        _id: postId, // Chercher le post par ID
        "comments._id": commentId, // Chercher le commentaire par ID
      },
      {
        $addToSet: {
          // Utiliser $addToSet pour ajouter l'userId aux likers du commentaire
          "comments.$.likers": req.userId, // req.userId est défini par votre middleware d'authentification donc l'utilisateur authentifié
        },
      },
      { new: true }
    );

    if (result) {
      res.status(200).send(result);
    } else {
      res.status(404).send("Post ou commentaire non trouvé.");
    }
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors du like du commentaire.",
    });
  }
};

// Uniker un comment
module.exports.unLikeComment = async (req, res) => {
  const postId = req.params.id;
  const { commentId } = req.body;

  if (!ObjectID.isValid(postId)) return res.status(400).send("Post ID inconnu");
  if (!ObjectID.isValid(commentId))
    return res.status(400).send("Comment ID inconnu");

  try {
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).send("Post non trouvé");
    }

    const result = await PostModel.findOneAndUpdate(
      {
        _id: postId, // Chercher le post par ID
        "comments._id": commentId, // Chercher le commentaire par ID
      },
      {
        $pull: {
          // Utiliser $pull pour retirer l'userId des likers du commentaire
          "comments.$.likers": req.userId, // req.userId est défini par votre middleware d'authentification donc l'utilisateur authentifié
        },
      },
      {
        new: true,
      }
    );

    if (result) {
      res.status(200).send(result);
    } else {
      res.status(500).json({});
    }
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors du unlike du commentaire.",
    });
  }
};
