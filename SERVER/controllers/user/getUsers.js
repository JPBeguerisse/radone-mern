const UserModel = require("../../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;
const bcrypt = require("bcrypt");

//récupérer tous les utilisateurs (sans mot de passe)
module.exports.getUsers = async (req, res) => {
  try {
    const users = await UserModel.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des utilisateurs.",
    });
  }
};

//récupérer un utilisateur par ID
module.exports.getUser = async (req, res) => {
  const userId = req.params.id;
  if (!ObjectID.isValid(userId))
    return res.status(400).send("ID utilisateur invalide : " + userId);

  try {
    const user = await UserModel.findById(userId).select("-password");

    user
      ? res.status(200).json(user)
      : res.status(404).send("Utilisateur non trouvé");
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération de l'utilisateur.",
    });
  }
};

//  récupérer un utilisateur par username
module.exports.getUserByUsername = async (req, res) => {
  const userName = req.params.username;
  if (!userName)
    return res.status(400).json({ message: "Nom d'utilisateur manquant" });
  try {
    const user = await UserModel.findOne({ userName }).select("-password");
    user
      ? res.status(200).json(user)
      : res.status(404).send("Utilisateur non trouvé");
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération de l'utilisateur.",
    });
  }
};
