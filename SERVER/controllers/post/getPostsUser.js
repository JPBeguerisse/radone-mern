const PostModel = require("../../models/post.model");
const ObjectID = require("mongoose").Types.ObjectId;

// Obtenir les posts d'un utilisateur spécifique avec id
module.exports.getPostsUser = async (req, res) => {
  const userId = req.params.id;

  if (!ObjectID.isValid(userId)) {
    return res.status(400).send("ID inconnu : " + userId);
  }

  try {
    // Récupérer ses posts via son ID
    const posts = await PostModel.find({ posterId: userId })
      .sort({
        createdAt: -1,
      })
      .lean();
    const sortedPosts = posts.map((post) => ({
      ...post,
      comments: post.comments.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      ),
    }));

    res.status(200).json(sortedPosts);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des posts de l'utilisateur.",
    });
  }
};

// Récupérer les posts d'un utilisateur spécifique avec username
module.exports.getPostsByUsername = async (req, res) => {
  const username = req.params.username;

  try {
    // Trouver l'utilisateur correspondant
    const user = await UserModel.findOne({ userName: username });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    // Récupérer ses posts via son ID
    const posts = await PostModel.find({ posterId: user._id })
      .sort({
        createdAt: -1,
      })
      .lean();

    const sortedPosts = posts.map((post) => ({
      ...post,
      comments: post.comments.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      ),
    }));

    res.status(200).json(sortedPosts);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des posts de l'utilisateur.",
    });
  }
};
