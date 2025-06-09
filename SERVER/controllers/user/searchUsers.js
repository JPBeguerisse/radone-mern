const UserModel = require("../../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;

//rechercher des utilisateurs par name ou userName
module.exports.searchUsers = async (req, res) => {
  const { query } = req.query; // Récupère la requête de recherche
  if (!query || query.trim() === "") {
    return res.status(400).json({ message: "Requête de recherche vide." });
  }
  try {
    // Recherche dans les champs "name" et "userName" avec une expression régulière
    const users = await UserModel.find({
      $or: [
        // "or" pour rechercher dans plusieurs champs
        { name: { $regex: query, $options: "i" } }, // "i" pour insensible à la casse
        { userName: { $regex: query, $options: "i" } },
      ],
    }).select("userName name picture"); // afficher uniquement les champs nécessaires

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la recherche d'utilisateurs.",
    });
  }
};
