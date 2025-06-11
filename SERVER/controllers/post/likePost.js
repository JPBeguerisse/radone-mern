const PostModel = require("../../models/post.model");
const ObjectID = require("mongoose").Types.ObjectId;

//Liiker un post
module.exports.like = async (req, res) => {
  const postId = req.params.id;

  if (!ObjectID.isValid(postId)) res.status(404).send("Unknow ID");

  try {
    const liked = await PostModel.findByIdAndUpdate(
      postId,
      {
        $addToSet: {
          //adToset ajoute seulement si l'id n'existe pas déjà
          likers: req.userId,
        },
      },
      { new: true }
    );

    liked
      ? res.status(200).json(liked)
      : res.status(404).send("Post non trouvé");
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors du like du post.",
    });
  }
};

// Unlike d'un post
module.exports.unlike = async (req, res) => {
  const postId = req.params.id;

  if (!ObjectID.isValid(postId)) {
    return res.status(400).send("ID inconnu");
  }

  try {
    // Utiliser $pull pour retirer l'ID de l'utilisateur de la liste des likers
    const unliked = await PostModel.findByIdAndUpdate(
      postId,
      {
        $pull: { likers: req.userId }, // Retire l'userId du tableau likers
      },
      { new: true }
    );

    unliked
      ? res.status(200).json(unliked)
      : res.status(404).send("Post non trouvé");
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors du unlike.",
    });
  }
};
