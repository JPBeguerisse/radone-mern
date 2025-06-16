const UserModel = require("../../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;

// ✅ Récupérer les utilisateurs suivis par un utilisateur avec pagination et recherch
module.exports.getFollowing = async (req, res) => {
  try {
    const { page = 1, limit = 5, search = "" } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const userId = req.userId; // Utiliser l'ID de l'utilisateur connecté
    const user = await UserModel.findById(userId).select("following");

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const totalFollowing = await UserModel.countDocuments({
      _id: { $in: user.following },
      $or: [
        { userName: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
      ],
    });

    const following = await UserModel.find({
      _id: { $in: user.following },
      $or: [
        { userName: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
      ],
    })
      .skip(skip)
      .limit(parseInt(limit))
      .select("userName name picture");

    res.status(200).json({
      following,
      total: totalFollowing,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors du chargement des utilisateurs suivis",
    });
  }
};

// Récupérer les followers de l'utilisateur connecté avec pagination et recherche
module.exports.getFollowers = async (req, res) => {
  try {
    const { page = 1, limit = 5, search = "" } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const userId = req.userId; // Utiliser l'ID de l'utilisateur connecté
    const user = await UserModel.findById(userId).select("followers");

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const totalFollowers = await UserModel.countDocuments({
      _id: { $in: user.followers },
      $or: [
        { userName: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
      ],
    });
    const followers = await UserModel.find({
      _id: { $in: user.followers },
      $or: [
        { userName: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
      ],
    })
      .skip(skip)
      .limit(parseInt(limit))
      .select("userName name picture");

    res.status(200).json({
      followers,
      total: totalFollowers,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors du chargement des utilisateurs suivis" });
  }
};

// Récupérer les utilisateurs suivis par un utilisateur spécifique
module.exports.getProfileFollowers = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!ObjectID.isValid(userId)) {
      return res.status(400).send("ID inconnu : " + userId);
    }
    // Trouver l'utilisateur correspondant
    const user = await UserModel.findById(userId).select("followers");
    if (!user) {
      return res.status(404).send("Utilisateur non trouvé");
    }
    // Récupérer les followers de l'utilisateur
    const followers = await UserModel.find({
      _id: { $in: user.followers },
    }).select("_id userName name picture");
    res.status(200).json(followers);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors du chargement des followers de l'utilisateur",
    });
  }
};

module.exports.getProfileFollowing = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!ObjectID.isValid(userId)) {
      return res.status(400).send("ID inconnu : " + userId);
    }
    // Trouver l'utilisateur correspondant
    const user = await UserModel.findById(userId).select("following");
    if (!user) {
      return res.status(404).send("Utilisateur non trouvé");
    }

    const reversedFollowing = user.following.slice().reverse(); // Inverser l'ordre pour afficher les derniers suivis en premier
    // Récupérer les utilisateurs suivis par l'utilisateur
    const following = await UserModel.find({
      _id: { $in: reversedFollowing },
    })
      .select("_id userName name picture")
      .limit(100); // Limiter à 100 utilisateurs pour éviter de surcharger la réponse
    res.status(200).json(following);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors du chargement des utilisateurs suivis",
    });
  }
};

// Suivre un utilisateur
module.exports.follow = async (req, res) => {
  console.log("👉 [FOLLOW] Route appelée avec : ", req.params.id, req.body);

  try {
    const userId = req.params.id;
    const { userIdToFollow } = req.body;

    if (!ObjectID.isValid(userId) || !ObjectID.isValid(userIdToFollow)) {
      return res.status(400).send("ID(s) invalide(s)");
    }

    const user = await UserModel.findById(userId).select("_id");
    const userToFollow = await UserModel.findById(userIdToFollow).select("_id");

    console.log("✅user:", user);
    if (!user || !userToFollow) {
      return res.status(404).send("Utilisateur introuvable");
    }
    // suivre un utilisateur
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        $addToSet: {
          // Utilise $addToSet pour éviter les doublons et ajouter l'ID de l'utilisateur à la liste des utilisateurs suivis
          following: userIdToFollow,
        },
      },
      { new: true }
    ).select("-password");
    console.log("✅updatedUser:", updatedUser);

    // Mettre à jour l'utilisateur suivi pour ajouter l'ID de l'utilisateur qui le suit
    await UserModel.findByIdAndUpdate(
      userIdToFollow,
      {
        $addToSet: {
          followers: userId,
        },
      },
      { new: true }
    );

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Erreur lors de l'ajout en tant que follower:", error);
    res.status(500).json({
      message: "Erreur lors de l'ajout en tant que follower.",
      error: error.message,
    });
  }
};

//se désabonner d’un utilisateur
module.exports.unfollow = async (req, res) => {
  const userId = req.params.id;
  const { userIdToUnfollow } = req.body;

  if (!ObjectID.isValid(userId) || !ObjectID.isValid(userIdToUnfollow)) {
    return res.status(400).send("ID unknown: " + userId, userIdToUnfollow);
  }

  const user = await UserModel.findById(userId).select("_id");
  const userToUnfollow = await UserModel.findById(userIdToUnfollow).select(
    "_id"
  );

  if (!user || !userToUnfollow) {
    return res.status(404).send("User not found");
  }

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        $pull: {
          // Utilise $pull pour retirer l'ID de l'utilisateur de la liste des utilisateurs suivis
          following: userIdToUnfollow,
        },
      },
      { new: true }
    ).select("-password");

    // Mettre à jour l'utilisateur suivi pour retirer l'ID de l'utilisateur qui se désabonne
    await UserModel.findByIdAndUpdate(
      userIdToUnfollow,
      {
        $pull: {
          followers: userId,
        },
      },
      { new: true }
    );

    return res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({
      message: "Une erreur est survenue lors du follow.",
    });
  }
};
