const PostModel = require("../../models/post.model");
const logger = require("../../utils/logger");
const ObjectID = require("mongoose").Types.ObjectId;

require("dotenv").config();

// Fonction pour créer un post avec cloudinary
module.exports.createPost = async (req, res) => {
  try {
    const { posterId, pictureUrl, publicId, message, video } = req.body;
    // Vérification des champs requis
    if (!posterId || (!pictureUrl && !message && !video)) {
      return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    // Création du nouveau post
    const newPost = new PostModel({
      posterId,
      picture: pictureUrl || null,
      public_id: publicId || null,
      message: message || null,
      video: video || null,
      likers: [],
      comments: [],
    });

    // Sauvegarde du post dans la base de données
    const savedPost = await newPost.save();

    // Retourne le post créé en réponse
    res.status(201).json(savedPost);
    logger.info("✅ Post créé avec succès:", {
      postId: savedPost._id,
      posterId: savedPost.posterId,
    });
  } catch (error) {
    res.status(500).json({
      message: "Une erreur est survenue lors de la création du post.",
    });
    logger.error("❌ Erreur lors de la création du post:", {
      error: error.message,
    });
  }
};
