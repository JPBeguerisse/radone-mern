const PostModel = require("../../models/post.model");
const ObjectID = require("mongoose").Types.ObjectId;
const UserModel = require("../../models/user.model");
const logger = require("../../utils/logger");
// Obtenir les posts des utilisateurs suivis
module.exports.getPostsFollowing = async (req, res) => {
  try {
    // const userId = req.params.id;
    const userId = req.userId; // Utiliser l'ID de l'utilisateur connecté
    const { skip = 0, limit = 5 } = req.query;

    if (!ObjectID.isValid(userId)) {
      return res.status(400).send("ID inconnu : " + userId);
    }

    // Trouver l'utilisateur correspondant
    const user = await UserModel.findById(userId);

    if (!user.following.includes(userId)) {
      user.following.push(userId); // S'assurer qu'on voit ses propres posts
    }

    const posts = await PostModel.find({
      posterId: { $in: user.following },
    })
      .sort({ createdAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .lean();

    const total = await PostModel.countDocuments({
      posterId: { $in: user.following },
    });

    const sortedPosts = posts.map((post) => ({
      ...post,
      comments: post.comments.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      ),
    }));

    res.status(200).json(sortedPosts);
  } catch (error) {
    res.status(500).json({
      message: "Une erreur est survenue lors de la récupération des posts.",
      error: error.message,
    });
  }
};

// Obtenir les posts des non-suivis (For You)
module.exports.getPostsForYou = async (req, res) => {
  try {
    const userId = req.params.id;
    const { skip = 0, limit = 5 } = req.query;

    if (!ObjectID.isValid(userId)) {
      return res.status(400).send("ID inconnu : " + userId);
    }

    // Trouver l'utilisateur correspondant
    const user = await UserModel.findById(userId);

    const posts = await PostModel.find({
      posterId: { $nin: [...user.following, userId] }, // Exclure les posts des utilisateurs non-suivis et de l'utilisateur lui-même
    })
      .sort({ createdAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .lean();

    // Trier les commentaires dans chaque post en ordre croissant (du plus ancien au plus récent)
    const sortedPosts = posts.map((post) => ({
      ...post,
      comments: post.comments.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      ),
    }));

    // res.status(200).json({ posts: sortedPosts, total });
    res.status(200).json(sortedPosts);
    logger.info(`✅ Posts 'For You' récupérés pour l'utilisateur ${userId}`, {
      userId,
      postsCount: sortedPosts.length,
    });
  } catch (error) {
    res.status(500).json({
      message:
        "Une erreur est survenue lors de la récupération des posts 'For You'.",
    });
    logger.error(
      "❌ Erreur lors de la récupération des posts 'For You':",
      error.message,
      { userId, error: error.message }
    );
  }
};
