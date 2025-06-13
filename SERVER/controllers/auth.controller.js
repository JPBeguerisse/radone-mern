const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();
const logger = require("../utils/logger");

// const maxAge = 3 * 24 * 60 * 60 * 1000; // 3 jours
const maxAge = 1 * 60 * 60 * 1000; // 1h

// Inscription avec envoi d'un lien de confirmation par e-mail
module.exports.signUp = async (req, res) => {
  const { name, userName, email, password } = req.body;
  const errors = {};

  // Vérification des champs requis
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
    // Vérification des doublons
    const isExistEmail = await UserModel.findOne({ email });
    if (isExistEmail) {
      errors.email = "Cette adresse email est déjà utilisée!";
    }

    const isExistUserName = await UserModel.findOne({ userName });
    if (isExistUserName) {
      errors.userName = "Ce username existe déjà!";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    // const pendingUser = await PendingUserModel.create({
    //   name,
    //   userName,
    //   email,
    //   password: hashedPassword,
    // });

    //Création du token de confirmation
    const token = jwt.sign(
      { name, userName, email, password: hashedPassword },
      process.env.JWT_SECRET,
      {
        expiresIn: maxAge,
      }
    );

    // const token = jwt.sign({ id: pendingUser._id }, process.env.JWT_SECRET, {
    //   expiresIn: maxAge,
    // });

    const confirmationUrl = `${process.env.REACT_APP_CLIENT_URL}/confirmation/${token}`;

    // Envoi de l'e-mail via Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Mon App" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Confirmez votre inscription",
      html: `<p>Bonjour ${name},</p>
    <p>Merci de vous être inscrit. Cliquez sur ce lien pour activer votre compte :</p>
    <a href="${confirmationUrl}">Confirmer mon adresse e-mail</a>`,
    });

    return res.status(200).json({
      message: "Un lien de confirmation vous a été envoyé par e-mail.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de l'inscription", error: error.message });
  }
};

// Confirmation d'email via le lien reçu
module.exports.confirmEmail = async (req, res) => {
  try {
    const { token } = req.params; // Récupérer le token de l'URL
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Vérifier le token

    // const pendingUser = await PendingUserModel.findById(decoded.id);
    // if (!pendingUser) {
    //   return res.status(404).json({ message: "Utilisateur non trouvé." });
    // }

    const { name, userName, email, password } = decoded; // Extraire les informations du token
    const user = await UserModel.create({
      name,
      userName,
      email,
      password, // Le mot de passe est déjà haché dans le token
    });
    return res.status(201).json({ message: "Compte activé avec succès." });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Lien invalide ou expiré.", error: error.message });
  }
};

// Demande de mot de passe oublié
module.exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "Aucun compte trouvé." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15min",
    });

    const resetUrl = `${process.env.REACT_APP_CLIENT_URL}/reset-password/${token}`;

    // Envoi de l'e-mail via Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const html = `
      <h2>Réinitialisation de mot de passe</h2>
      <p>Bonjour ${user.userName},</p>
      <p>Clique sur ce lien pour réinitialiser ton mot de passe :</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>Ce lien expire dans 15 minutes.</p>
    `;

    await transporter.sendMail({
      from: `"Mon App" <${process.env.MAIL_USER}>`,
      to: user.email,
      subject: "Réinitialisation de mot de passe",
      html: html,
    });

    res.status(200).json({ message: "Email envoyé avec succès." });
    logger.info(
      `✅Email de réinitialisation envoyé à ${user.email} pour l'utilisateur ${user.userName}`
    );
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de l’envoi de l’e-mail.",
    });
    logger.error("❌ Erreur d'envoie de l'email", error.message);
  }
};
// Réinitialisation du mot de passe
module.exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded.id);
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé." });

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Mot de passe réinitialisé avec succès." });
    logger.info(
      `✅ Mot de passe réinitialisé pour l'utilisateur ${user.userName} (${user.email})`
    );
  } catch (error) {
    res.status(400).json({ message: "Lien invalide ou expiré." });
    logger.error(
      "❌ Erreur de réinitialisation du mot de passe",
      error.message
    );
  }
};

// Connexion avec vérification des identifiants
module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });

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

// Connexion en tant qu'invité
module.exports.loginGuest = async (req, res) => {
  try {
    const guestUser = await UserModel.findOne({ isGuest: true });

    if (!guestUser)
      return res
        .status(404)
        .json({ message: "Utilisateur invité introuvable." });

    const token = jwt.sign({ id: guestUser._id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// Déconnexion
module.exports.logout = (req, res) => {
  res.status(200).json({ message: "Déconnexion réussie." });
};
