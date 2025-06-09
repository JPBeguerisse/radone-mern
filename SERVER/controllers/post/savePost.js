const PostModel = require("../../models/post.model");
const ObjectID = require("mongoose").Types.ObjectId;

// Obtenir les posts sauvegardés par un utilisateur
module.exports.getSavedPosts = async (req, res) => {
  const userId = req.params.id;

  if (!ObjectID.isValid(userId)) {
    return res.status(400).send("ID inconnu : " + userId);
  }

  try {
    const posts = await PostModel.find({ savedBy: userId }).sort({
      createdAt: -1,
    });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({
      message:
        "Une erreur est survenue lors de la récupération des posts sauvegardés.",
    });
  }
};

//Sauvegarder un post
module.exports.savePost = async (req, res) => {
  const postId = req.params.id;
  const { userId } = req.body;

  // Vérification des IDs
  if (!ObjectID.isValid(postId))
    return res.status(400).send("Post ID invalide");
  if (!ObjectID.isValid(userId))
    return res.status(400).send("User ID invalide");

  try {
    const savedPost = await PostModel.findByIdAndUpdate(
      postId,
      {
        // Utiliser $addToSet pour ajouter l'userId au tableau savedBy
        $addToSet: {
          savedBy: userId,
        },
      },
      { new: true }
    );
    if (!savedPost) return res.status(404).send("Post non trouvé");

    res.status(200).json(savedPost);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur serveur lors de l'enregistrement du post." });
  }
};

// Retirer un post sauvegardé
module.exports.unsavePost = async (req, res) => {
  const postId = req.params.id;
  const { userId } = req.body;

  if (!ObjectID.isValid(postId))
    return res.status(400).send("Post ID invalide");
  if (!ObjectID.isValid(userId))
    return res.status(400).send("User ID invalide");

  try {
    const unSavedPost = await PostModel.findByIdAndUpdate(
      postId,
      {
        $pull: { savedBy: userId }, // Retire l'userId du tableau
      },
      { new: true }
    );

    if (!unSavedPost) return res.status(404).send("Post non trouvé");

    res.status(200).json(unSavedPost);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur serveur lors du retrait du post." });
  }
};
