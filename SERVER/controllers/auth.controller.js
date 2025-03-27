//auth.controller.js
const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const maxAge = 3 * 24 * 60 * 60 * 1000;

module.exports.signUp = async (req, res) => {
  const { name, userName, email, password } = req.body;
  console.log("bODYYYY", name, userName, email, password);

  // Vérification de base
  // Vérification des champs requis
  if (!name) {
    return res.status(400).json({ message: "Le nom complet est requis." });
  }

  if (name.length < 3) {
    return res
      .status(400)
      .json({ message: "Le nom complet doit contenir 3 caractères minimum." });
  }

  if (!userName) {
    return res.status(400).json({ message: "Le nom de profil est requis." });
  }

  if (userName.length < 2) {
    return res.status(400).json({
      message: "Le nom de profil doit contenir 2 caractères minimum.",
    });
  }

  if (!email) {
    return res.status(400).json({ message: "L'adresse email est requise." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ message: "L'adresse email n'est pas valide." });
  }

  if (!password) {
    return res.status(400).json({ message: "Le mot de passe est requis." });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message: "Le mot de passe doit contenir au moins 6 caractères.",
    });
  }

  try {
    const isExistEmail = await UserModel.findOne({ email });
    if (isExistEmail) {
      return res
        .status(400)
        .json({ message: "Cette adresse email existe déjà!" });
    }

    const isExistUserName = await UserModel.findOne({ userName });
    if (isExistUserName) {
      return res.status(400).json({
        message: "Ce username existe déjà!",
      });
    }

    const user = await UserModel.create({
      name,
      userName,
      email,
      password,
    });

    res.status(201).json({ user: user.id });
    console.log(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de l'inscription", error: error.message });
    console.error("Erreur lors de l'inscription:", error);
  }
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: maxAge }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports.logout = (req, res) => {
  res.status(200).json({ message: "Déconnexion réussie." });
};
