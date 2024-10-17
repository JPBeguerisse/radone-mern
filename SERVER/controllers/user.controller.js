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

//Fonction pour modifier un user
module.exports.updateUser = async (req, res) => {
  const userId = req.params.id;
  if (!ObjectID.isValid(userId))
    return res.status(400).send("ID unknow" + userId);

  const { firstName, lastName, email, password } = req.body;
  // Construire un objet de mise à jour
  const updateFields = {};
  if (firstName) updateFields.firstName = firstName;
  if (lastName) updateFields.lastName = lastName;
  if (email) updateFields.email = email;

  if (password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    updateFields.password = hashedPassword;
  }

  try {
    const user = await UserModel.findByIdAndUpdate(
      { _id: userId },
      {
        $set: updateFields,
      },
      { new: true, upsert: true }
    );
    if (user) res.status(200).send(user);
    else res.status(400).send("User not found");
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Une erreur est survenue lors de la mis à jour de l'utilisateur.",
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
