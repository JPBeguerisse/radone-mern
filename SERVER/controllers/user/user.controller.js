const UserModel = require("../../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;
const bcrypt = require("bcrypt");

module.exports = {
  ...require("./getUsers"),
  ...require("./searchUsers"),
  ...require("./updateUser"),
  ...require("./follow"),
};

// ✅ Récupérer les followers d'un utilisateur
// module.exports.getFollowers = async (req, res) => {
//   // Vérification si l'ID est valide
//   if (!ObjectID.isValid(req.params.userId)) {
//     return res.status(400).send("ID unknown: " + req.params.userId);
//   }
//   try {
//     const user = await UserModel.findById(req.params.userId)
//       .populate("followers", "-password") // Exclure le mot de passe
//       .select("followers"); // Sélectionner uniquement le champ "followers"

//     res.status(200).json(user.followers);
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .json({ message: "Erreur lors du chargement des followers" });
//   }
// };

// ✅ Récupérer les utilisateurs suivis par un utilisateur
// module.exports.getFollowing = async (req, res) => {
//   // Vérification si l'ID est valide
//   if (!ObjectID.isValid(req.params.userId)) {
//     return res.status(400).send("ID unknown: " + req.params.userId);
//   }
//   try {
//     const user = await UserModel.findById(req.params.userId)
//       .populate("following", "-password") // Exclure le mot de passe
//       .select("following"); // Sélectionner uniquement le champ "following"

//     res.status(200).json(user.following);
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .json({ message: "Erreur lors du chargement des followers" });
//   }
// };
