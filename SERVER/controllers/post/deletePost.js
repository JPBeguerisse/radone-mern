const PostModel = require("../../models/post.model");
const ObjectID = require("mongoose").Types.ObjectId;
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Supprimer un post (Cloudinary)
module.exports.deletePost = async (req, res) => {
  const postId = req.params.id;
  // Vérifier si l'utilisateur est authentifié
  const userId = req.userId; // req.userId est défini par votre middleware d'authentification
  try {
    // Vérifier si l'ID du post est valide
    if (!ObjectID.isValid(postId)) {
      return res.status(400).send("ID de post invalide : " + postId);
    }

    // Chercher le post dans la base de données par son ID
    const postToDelete = await PostModel.findById(postId);

    if (!postToDelete) {
      return res.status(404).json({ message: "Post non trouvé" });
    }

    // verifier si l'utilisateur a les droits pour supprimer ce post
    if (postToDelete.posterId.toString() !== userId) {
      return res.status(403).json({
        message: "Vous n'avez pas les droits pour supprimer ce post.",
      });
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
      error: error.message,
    });
  }
};
