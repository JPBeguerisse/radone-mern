const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;
const bcrypt = require("bcrypt");

//Fonction pour récupérer tous les users
module.exports.getUsers = async (req, res) => {
  try {
    // Récupérer tous les utilisateurs en excluant le champ "password"
    const users = await UserModel.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    // Gérer les erreurs
    res.status(500).json({
      error:
        "Une erreur est survenue lors de la récupération des utilisateurs.",
    });
  }
};

//Fonction pour récupérer un user
module.exports.getUser = async (req, res) => {
  const userId = req.params.id;
  if (!ObjectID.isValid(userId))
    return res.status(400).send("ID unknown" + userId);

  try {
    const user = await UserModel.findById(userId).select("-password");
    if (user) res.status(200).json(user);
    else res.status(400).send("User not found");
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error:
        "Une erreur est survenue lors de la récupération de l'utilisateur.",
    });
  }
};

// Mise à jour d’un utilisateur
module.exports.updateUser = async (req, res) => {
  const userId = req.params.id;
  const errors = {}; // un objet pour collecter les erreurs

  // Vérifie que l'ID est un ObjectId valide
  if (!ObjectID.isValid(userId)) {
    return res.status(400).send("ID invalide : " + userId);
  }
  try {
    // Récupère l'utilisateur depuis la BDD
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

    // ✅ S’il y a des erreurs, on les renvoie toutes en une seule fois
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    // Mise à jour du user dans la base de données
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send("Utilisateur non trouvé");
    }

    // Réponse avec le user mis à jour
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
    res.status(500).json({
      error: "Une erreur est survenue lors de la mise à jour de l'utilisateur.",
    });
  }
};

//Fonction pour supprimer un user
module.exports.deleteUser = async (req, res) => {
  const userId = req.params.id;

  // Vérification si l'ID est valide
  if (!ObjectID.isValid(userId)) {
    return res.status(400).send("ID unknown: " + userId);
  }

  try {
    // Trouver et supprimer l'utilisateur
    const deletedUser = await UserModel.findByIdAndDelete(userId).select(
      "-password"
    );

    // Si l'utilisateur n'existe pas
    if (!deletedUser) {
      return res.status(404).send("User not found");
    }

    // Si l'utilisateur a été supprimé avec succès
    res
      .status(200)
      .send({ message: "Successfully deleted", user: deletedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Une erreur est survenue lors de la suppression de l'utilisateur.",
    });
  }
};
