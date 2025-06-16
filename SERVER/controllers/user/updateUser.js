const UserModel = require("../../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;
const DeletedUserModel = require("../../models/deletedUser.model");
const PostModel = require("../../models/post.model");
const logger = require("../../utils/logger");
// Mise à jour d’un utilisateur
module.exports.updateUser = async (req, res) => {
  const userId = req.params.id;
  const errors = {}; // un objet pour collecter les erreurs

  // Vérifie que l'ID est un ObjectId valide
  if (!ObjectID.isValid(userId)) {
    return res.status(400).send("ID invalide : " + userId);
  }
  try {
    const user = await UserModel.findById(userId);
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé." });

    const { name, userName, email, bio, oldPassword, newPassword } = req.body;

    // Création d’un objet contenant uniquement les champs à mettre à jour
    const updateFields = {};
    if (name) updateFields.name = name;
    if (userName) updateFields.userName = userName;
    if (email) updateFields.email = email;
    if (bio !== undefined) updateFields.bio = bio;

    //Gestion du changement de mot de passe
    if (oldPassword && newPassword) {
      // Vérifie la robustesse du nouveau mot de passe
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

      if (!passwordRegex.test(newPassword)) {
        errors.newPassword =
          "Le nouveau mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.";
      }

      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isPasswordValid) {
        errors.oldPassword = "Ancien mot de passe incorrect.";
      }

      const salt = await bcrypt.genSalt(10);
      const hashedNewPassword = await bcrypt.hash(newPassword, salt);
      updateFields.password = hashedNewPassword;
    }

    // Vérifie si l'email existe déjà dans un autre compte
    if (email) {
      const isExistEmail = await UserModel.findOne({ email });
      if (isExistEmail && isExistEmail._id.toString() !== userId) {
        errors.email = "Cette adresse email est déjà utilisée.";
      }
    }

    // Vérifie si le username existe déjà dans un autre compte
    if (userName) {
      const isExistUserName = await UserModel.findOne({ userName });
      if (isExistUserName && isExistUserName._id.toString() !== userId) {
        errors.userName = "Ce nom d'utilisateur est déjà utilisé.";
      }
    }

    // S’il y a des erreurs, on les renvoie toutes en une seule fois
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    // Mise à jour du user dans la base de données
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: updateFields }, // Utilisation de $set pour mettre à jour uniquement les champs modifiés
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send("Utilisateur non trouvé");
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour de l'utilisateur.",
    });
  }
};

//suppression d’un utilisateur
module.exports.deleteUser = async (req, res) => {
  const userId = req.userId; // Utilisateur connecté récupéré depuis le middleware d'authentification

  // Vérification si l'ID est valide
  if (!ObjectID.isValid(userId)) {
    return res.status(400).send("ID invalide : " + userId);
  }

  try {
    const user = await UserModel.findById(userId);

    if (!user)
      return res.status(404).json({ message: "Utilisateur introuvable." });

    // Vérification si l'utilisateur est un compte invité
    if (user.isGuest) {
      return res
        .status(403)
        .json({ message: "Le compte invité ne peut pas être supprimé." });
    }

    // 🔁 Sauvegarder dans DeletedUser avant suppression
    await DeletedUserModel.create({
      originalId: user._id,
      userName: user.userName,
      email: user.email,
      picture: user.picture,
      reason: "Suppression volontaire de l'utilisateur", // optionnel
    });

    // Supprimer les références dans les followers et followings des autres utilisateurs
    await UserModel.updateMany(
      { followers: userId },
      { $pull: { followers: userId } }
    );

    await UserModel.updateMany(
      { following: userId },
      { $pull: { following: userId } }
    );

    // Supprimer les likes de l'utilisateur sur les posts
    await PostModel.updateMany(
      { likers: userId },
      { $pull: { likers: userId } }
    );

    // Supprimer les posts de l'utilisateur
    await PostModel.deleteMany({ posterId: userId });

    // Supprimer l'utilisateur lui-même
    await UserModel.findByIdAndDelete(userId);
    res.status(200).json({
      message: "Compte supprimé avec succès.",
    });
    logger.info("Utilisateur supprimé avec succès", {
      userId,
      userName: user.userName,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression de l'utilisateur.",
    });
    logger.error(
      "Erreur lors de la suppression de l'utilisateur:",
      error.message,
      {
        userId,
        error: error.message,
      }
    );
  }
};

// route
module.exports.getArchivedUsers = async (req, res) => {
  const deleted = await DeletedUserModel.find().sort({ deletedAt: -1 });
  res.status(200).json(deleted);
};
