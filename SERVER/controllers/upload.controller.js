const UserModel = require("../models/user.model");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "profil", // nom du dossier dans Cloudinary
    allowed_formats: ["jpg", "png", "jpeg"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

//avec multer
// module.exports.uploadProfil = async (req, res) => {
//   const pseudo = req.body.pseudo;

//   const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       const uploadDir = path.join(__dirname, "../uploads/profil");
//       if (!fs.existsSync(uploadDir)) {
//         fs.mkdirSync(uploadDir);
//       }
//       cb(null, uploadDir);
//     },
//     filename: (req, file, cb) => {
//       const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//       cb(null, uniqueSuffix + path.extname(file.originalname));
//     },
//   });

//   const upload = multer({
//     storage: storage,
//     limits: { fileSize: 500 * 1024 }, // Limite de taille de fichier à 500 Ko
//     fileFilter: (req, file, cb) => {
//       const filetypes = /jpeg|jpg|png/;
//       const mimetype = filetypes.test(file.mimetype);
//       const extname = filetypes.test(
//         path.extname(file.originalname).toLowerCase()
//       );

//       if (mimetype && extname) {
//         return cb(null, true);
//       } else {
//         cb(
//           new Error(
//             "Le fichier doit être une image au format PNG, JPG ou JPEG, et ne doit pas dépasser 500 Ko."
//           )
//         );
//       }
//     },
//   }).single("profileImage");

//   upload(req, res, async (err) => {
//     if (err) {
//       //const errors = {};
//       return res
//         .status(500)
//         .json({ message: "Erreur lors de l'upload du fichier.", err });
//     }

//     try {
//       const imagePath = `/uploads/profil/${req.file.filename}`;
//       const userId = req.body.userId;

//       console.log("ROUTE img", imagePath);

//       // Récupérer l'utilisateur pour obtenir le chemin de l'ancienne image
//       const user = await UserModel.findById(userId);

//       if (!user) {
//         return res.status(404).json({ message: "Utilisateur non trouvé." });
//       }

//       // Si l'utilisateur a déjà une image de profil, la supprimer
//       if (user.picture) {
//         const oldImagePath = path.join(__dirname, "../", user.picture);
//         console.log("img", oldImagePath);
//         if (oldImagePath !== "/app/uploads/profil/random-user.jpeg") {
//           fs.unlink(oldImagePath, (err) => {
//             if (err) {
//               console.error(
//                 "Erreur lors de la suppression de l'ancienne image:",
//                 err
//               );
//             } else {
//               console.log("Ancienne image supprimée:", user.picture);
//             }
//           });
//         }
//       }

//       // Mettre à jour l'utilisateur avec le chemin de la nouvelle image
//       if (imagePath) {
//         user.picture = imagePath;
//         await user.save();
//       } else {
//         user.picture = "/uploads/profil/";
//       }

//       res.status(200).json({ message: "Image uploadée avec succès.", user });
//     } catch (error) {
//       res.status(500).json({
//         message: "Erreur lors de la mise à jour de l'utilisateur.",
//         error,
//       });
//     }
//   });
// };

module.exports.updatePicture = async (req, res) => {
  try {
    const { userId, pictureUrl, publicId } = req.body;

    const user = await UserModel.findById(userId);
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé." });

    // Supprimer ancienne image si elle existe et est sur Cloudinary
    if (
      user.public_id &&
      user.picture &&
      user.picture.includes("res.cloudinary.com")
    ) {
      await cloudinary.uploader.destroy(user.public_id);
    }

    // Mise à jour de la photo et du public_id
    user.picture = pictureUrl;
    user.public_id = publicId;
    await user.save();

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err });
  }
};

module.exports.removeProfilePicture = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await UserModel.findById(userId);
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    if (user.public_id && user.picture) {
      // Supprimer l'image de Cloudinary
      await cloudinary.uploader.destroy(user.public_id);
    }
    // Réinitialiser la photo dans la base
    user.picture = "/random-user.jpeg";
    user.public_id = null; // Réinitialiser le public_id
    await user.save();
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression de la photo" });
  }
};

// module.exports.removePicture = async (req, res) => {
//   try {
//     const userId = req.params.id;

//     const user = await UserModel.findById(userId);
//     if (!user)
//       return res.status(404).json({ message: "Utilisateur non trouvé" });
//     if (user.picture) {
//       const oldImagePath = path.join(__dirname, "../", user.picture);
//       if (oldImagePath !== "/app/uploads/profil/random-user.jpeg") {
//         fs.unlink(oldImagePath, (err) => {
//           if (err) {
//             console.error(
//               "Erreur lors de la suppression de l'ancienne image:",
//               err
//             );
//           } else {
//             console.log("Ancienne image supprimée:", user.picture);
//           }
//         });
//       }
//     }

//     // Réinitialiser la photo dans la base
//     user.picture = "uploads/profil/random-user.jpeg";
//     await user.save();

//     res.status(200).json(user);
//   } catch (err) {
//     console.error(err);
//     res
//       .status(500)
//       .json({ message: "Erreur lors de la suppression de la photo" });
//   }
// };
