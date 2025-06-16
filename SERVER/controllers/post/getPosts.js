const PostModel = require("../../models/post.model");
const logger = require("../../utils/logger");
const ObjectID = require("mongoose").Types.ObjectId;

//Obtenir tous les posts (triés)
module.exports.getAllPosts = async (req, res) => {
  try {
    const posts = await PostModel.find().sort({ createdAt: -1 }).lean(); // Trier par date de création;
    // Trier les commentaires dans chaque post en ordre croissant (du plus ancien au plus récent)
    const sortedPosts = posts.map((post) => ({
      ...post,
      comments: post.comments.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      ),
    }));

    res.status(200).json(sortedPosts);
    logger.info("✅ Tous les posts récupérés avec succès");
  } catch (error) {
    res.status(500).json({
      message: "Une erreur est survenue lors de la récupération des posts.",
    });
    logger.error("❌ Erreur lors de la récupération des posts:", {
      error: error.message,
    });
  }
};

//Obtenir les posts avec pagination simple
// Non utilisé dans l'application, mais peut être utile pour des requêtes spécifiques
module.exports.getPosts = async (req, res) => {
  const limit = parseInt(req.query.limit) || 5;
  const skip = parseInt(req.query.skip) || 0;

  try {
    const posts = await PostModel.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(); // Utilisation de `.lean()` pour un objet JS pur

    // Trier les commentaires dans chaque post en ordre croissant (du plus ancien au plus récent)
    const sortedPosts = posts.map((post) => ({
      ...post,
      comments: post.comments.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      ),
    }));

    res.status(200).json(sortedPosts);
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors du chargement des posts",
      error: err.message,
    });
  }
};

//Obtenir un post par ID
module.exports.getPost = async (req, res) => {
  const postId = req.params.id;

  if (!ObjectID.isValid(postId)) {
    return res.status(400).send("ID inconnu : " + postId);
  }

  try {
    const post = await PostModel.findById(postId).lean();

    if (!post) {
      return res.status(404).send("Post not found");
    }

    // ✅ Tri des commentaires du plus récent au plus ancien (si présents)
    if (post.comments && Array.isArray(post.comments)) {
      post.comments.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
    }

    res.status(200).json(post);
    logger.info("✅ Post récupéré avec succès:", {
      postId,
    });
  } catch (error) {
    res.status(500).json({
      message: "Une erreur est survenue lors de la récupération du post.",
    });
    logger.error("❌ Erreur lors de la récupération du post:", {
      error: error.message,
      postId,
    });
  }
};
