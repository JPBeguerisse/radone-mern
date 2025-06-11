const PostModel = require("../../models/post.model");
const ObjectID = require("mongoose").Types.ObjectId;

// Mettre à jour un post
module.exports.updatePost = async (req, res) => {
  const postId = req.params.id;
  const { message, picture } = req.body;

  // Vérifier si l'ID du post est valide
  if (!ObjectID.isValid(postId)) {
    return res.status(400).send("ID de post invalide : " + postId);
  }

  // Vérifier si au moins un champ à mettre à jour est fourni
  if (!message) {
    return res.status(400).send("Aucun champ à mettre à jour fourni");
  }

  // Vérifier si les champs message et picture sont valides
  if (message && typeof message !== "string") {
    return res
      .status(400)
      .send("Le message doit être une chaîne de caractères");
  }

  //si le user a le droit de mettre à jour le post

  // Créer un objet updateFields avec uniquement les champs à mettre à jour
  const updateFields = {};
  if (message) updateFields.message = message;
  if (picture) updateFields.picture = picture;

  try {
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).send("Post non trouvé");
    }
    if (post.posterId.toString() !== req.userId) {
      return res
        .status(403)
        .send("Vous n'avez pas les droits pour mettre à jour ce post.");
    }
    // Chercher et mettre à jour le post en utilisant les champs fournis
    const updatedPost = await PostModel.findByIdAndUpdate(
      postId,
      { $set: updateFields }, // Champs à mettre à jour
      { new: true } // Retourner le post mis à jour
    );

    if (updatedPost) {
      res.status(200).json(updatedPost);
    } else {
      res.status(404).send("Post non trouvé");
    }
  } catch (error) {
    res.status(500).json({
      message: "Une erreur est survenue lors de la mise à jour du post.",
    });
  }
};
