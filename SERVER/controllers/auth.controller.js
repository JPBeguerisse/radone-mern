//auth.controller.js
const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const maxAge = 3 * 24 * 60 * 60 * 1000;

module.exports.signUp = async (req, res) => {
  const { name, userName, email, password } = req.body;
  const errors = {};

  if (!name) {
    errors.name = "Le nom complet est requis.";
  }

  if (name.length < 3) {
    errors.name = "Le nom complet doit contenir 3 caractères minimum.";
  }

  if (!userName) {
    errors.userName = "Le nom de profil est requis.";
  }

  if (userName.length < 2) {
    errors.userName = "Le nom de profil doit contenir 2 caractères minimum.";
  }

  if (!email) {
    errors.email = "L'adresse email est requise.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.email = "L'adresse email n'est pas valide.";
  }

  if (!password) {
    errors.password = "Le mot de passe est requis.";
  }

  if (password.length < 6) {
    errors.password = "Le mot de passe doit contenir au moins 6 caractères.";
  }

  try {
    const isExistEmail = await UserModel.findOne({ email });
    if (isExistEmail) {
      errors.email = "Cette adresse email existe déjà!";
    }

    const isExistUserName = await UserModel.findOne({ userName });
    if (isExistUserName) {
      errors.userName = "Ce username existe déjà!";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
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

    // if (!user)
    //   return res.status(404).json({ message: "Utilisateur non trouvé" });

    // const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) {
    //   return res.status(400).json({ message: "Mot de passe incorrect" });
    // }

    // Si l'utilisateur n'est pas trouvé ou si le mot de passe ne correspond pas
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(400)
        .json({ message: "Email ou mot de passe incorrect" });
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
