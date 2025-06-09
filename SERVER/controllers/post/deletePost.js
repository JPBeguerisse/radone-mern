const PostModel = require("../../models/post.model");
const ObjectID = require("mongoose").Types.ObjectId;

// Supprimer un post (Cloudinary)
module.exports.deletePost = async (req, res) => {
  const postId = req.params.id;
  try {
    // Chercher le post dans la base de données par son ID
    const postToDelete = await PostModel.findById(postId);

    if (!postToDelete) {
      return res.status(404).json({ message: "Post non trouvé" });
    }

    // Si le post contient une image sur Cloudinary, supprimer l'image
    if (postToDelete.public_id) {
      await cloudinary.uploader.destroy(postToDelete.public_id);
    }

    // Supprimer le post de la base de données
    await PostModel.findByIdAndDelete(postId);

    // Retourner un message de succès après la suppression
    res.status(200).json({ message: "Post et image supprimés avec succès." });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression du post",
    });
  }
};
