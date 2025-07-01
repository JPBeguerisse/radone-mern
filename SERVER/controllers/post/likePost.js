const PostModel = require("../../models/post.model");
const ObjectID = require("mongoose").Types.ObjectId;
const UserModel = require("../../models/user.model");

//Liiker un post
// module.exports.like = async (req, res) => {
//   try {
//     const postId = req.params.id;

//     if (!ObjectID.isValid(postId)) res.status(404).send("Unknow ID");
//     const liked = await PostModel.findByIdAndUpdate(
//       postId,
//       {
//         $addToSet: {
//           //adToset ajoute seulement si l'id n'existe pas déjà
//           likers: req.userId,
//         },
//       },
//       { new: true }
//     );

//     if (!liked) {
//       return res.status(404).send("Post non trouvé");
//     }

//     console.log("✅Liked post:", liked);

//     return res.status(200).json(liked);

//     // liked
//     //   ? res.status(200).json(liked)
//     //   : res.status(404).send("Post non trouvé");
//   } catch (error) {
//     console.error("❌ Erreur lors du like du post:", error.message);
//     res.status(500).json({
//       message: "Erreur lors du like du post.",
//     });
//   }
// };

module.exports.like = async (req, res) => {
  try {
    const postId = req.params.id;
    console.log("▶️ Requête PATCH reçue pour post:", postId);
    console.log("▶️ Utilisateur connecté:", req.userId);

    if (!ObjectID.isValid(postId)) {
      console.log("❌ ID invalide");
      return res.status(404).send("Unknow ID");
    }

    if (!req.userId) {
      console.log("❌ Utilisateur non connecté");
      return res.status(401).json({ message: "Non authentifié" });
    }

    const liked = await PostModel.findByIdAndUpdate(
      postId,
      {
        $addToSet: {
          likers: req.userId,
        },
      },
      { new: true }
    );

    if (!liked) {
      return res.status(404).send("Post non trouvé");
    }

    console.log("✅ Liked avec succès :", liked);
    return res.status(200).json(liked);
  } catch (error) {
    console.error("❌ Erreur dans la route LIKE :", error.message);
    return res.status(500).json({ message: "Erreur serveur" });
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

    if (!unliked) {
      return res.status(404).send("Post non trouvé");
    }
    console.log("✅ Unliked post:", unliked);
    return res.status(200).json(unliked);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors du unlike.",
    });
  }
};

//Récupérer les likers d'un post
// module.exports.getLikers = async (req, res) => {
//   const { page = 1, limit = 5, search = "" } = req.query;
//   const postId = req.params.id;

//   if (!ObjectID.isValid(postId)) {
//     return res.status(400).send("ID inconnu");
//   }

//   try {
//     // Récupère les IDs des likers
//     const post = await PostModel.findById(postId).select("likers");

//     if (!post) {
//       return res.status(404).send("Post non trouvé");
//     }

//     // Filtrage et pagination manuelle
//     let likerIds = post.likers;

//     if (search) {
//       // Recherche parmi les utilisateurs likés par userName
//       const filteredUsers = await UserModel.find({
//         _id: { $in: likerIds },
//         userName: { $regex: search, $options: "i" },
//       }).select("_id");
//       likerIds = filteredUsers.map((u) => u._id);
//     }

//     //
//     const total = likerIds.length;
//     const start = (page - 1) * limit;
//     const end = start + parseInt(limit);

//     const paginatedLikerIds = likerIds.slice(start, end);

//     // Récupère les infos des utilisateurs paginés
//     const likers = await UserModel.find({
//       _id: { $in: paginatedLikerIds },
//     }).select("_id userName picture");

//     res.status(200).json({
//       likers,
//       total,
//       page: parseInt(page),
//       totalPages: Math.ceil(total / limit),
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Erreur lors de la récupération des likers.",
//     });
//   }
// };

module.exports.getLikers = async (req, res) => {
  const postId = req.params.id;

  if (!ObjectID.isValid(postId)) {
    return res.status(400).send("ID inconnu");
  }

  try {
    const post = await PostModel.findById(postId).select("likers");

    if (!post) {
      return res.status(404).send("Post non trouvé");
    }

    // _id $in permet de récupérer les utilisateurs dont l'ID est dans le tableau likers
    // On utilise select pour ne récupérer que les champs nécessaires
    // _id, userName et picture
    const reversedLikers = post.likers.slice().reverse(); // copie + reverse

    const likers = await UserModel.find({ _id: { $in: reversedLikers } })
      .select("_id userName picture")
      .limit(100);

    res.status(200).json(likers);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des likers.",
    });
  }
};
