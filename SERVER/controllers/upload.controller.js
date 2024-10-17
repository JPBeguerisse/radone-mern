const UserModel = require("../models/user.model");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
// const { uploadErrors } = require("../utils/errors.utils");

module.exports.uploadProfil = async (req, res) => {
  const pseudo = req.body.pseudo;

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(__dirname, "../uploads/profil");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  });

  const upload = multer({
    storage: storage,
    limits: { fileSize: 500 * 1024 }, // Limite de taille de fichier à 500 Ko
    fileFilter: (req, file, cb) => {
      const filetypes = /jpeg|jpg|png/;
      const mimetype = filetypes.test(file.mimetype);
      const extname = filetypes.test(
        path.extname(file.originalname).toLowerCase()
      );

      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb(
          new Error(
            "Le fichier doit être une image au format PNG, JPG ou JPEG, et ne doit pas dépasser 500 Ko."
          )
        );
      }
    },
  }).single("profileImage");

  upload(req, res, async (err) => {
    if (err) {
      const errors = uploadErrors(err);
      return res
        .status(500)
        .json({ message: "Erreur lors de l'upload du fichier.", errors });
    }

    try {
      const imagePath = `/uploads/profil/${req.file.filename}`;
      const userId = req.body.userId;

      // Récupérer l'utilisateur pour obtenir le chemin de l'ancienne image
      const user = await UserModel.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé." });
      }

      // Si l'utilisateur a déjà une image de profil, la supprimer
      if (user.picture) {
        const oldImagePath = path.join(__dirname, "../", user.picture);
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error(
              "Erreur lors de la suppression de l'ancienne image:",
              err
            );
          } else {
            console.log("Ancienne image supprimée:", user.picture);
          }
        });
      }

      // Mettre à jour l'utilisateur avec le chemin de la nouvelle image
      user.picture = imagePath;
      await user.save();

      res.status(200).json({ message: "Image uploadée avec succès.", user });
    } catch (error) {
      res.status(500).json({
        message: "Erreur lors de la mise à jour de l'utilisateur.",
        error,
      });
    }
  });
};
