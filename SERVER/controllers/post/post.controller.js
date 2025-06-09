const PostModel = require("../../models/post.model");
const ObjectID = require("mongoose").Types.ObjectId;
const UserModel = require("../../models/user.model");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = {
  ...require("./createPost"),
  ...require("./getPosts"),
  ...require("./getPostsUser"),
  ...require("./getPostsFiltered"),
  ...require("./updatePost"),
  ...require("./deletePost"),
  ...require("./likePost"),
  ...require("./commentPost"),
  ...require("./savePost"),
  ...require("./likeComment"),
};

//Fonction pour créer un post avec multer
// module.exports.createPost = async (req, res) => {
//   //GERER L'UPLOAD
//   const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       const uploadDir = path.join(__dirname, "../uploads/posts");
//       console.log("Upload directory:", uploadDir);
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

//   // Configuration de multer pour la validation des fichiers
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
//   }).single("postImage");

//   upload(req, res, async (err) => {
//     if (err) {
//       return res.status(500).json({
//         message: "Erreur lors de l'upload de l'image.",
//         error: err.message,
//       });
//     }
//     try {
//       const { posterId, message, video } = req.body;
//       const imagePath = req.file ? `/uploads/posts/${req.file.filename}` : null;
//       const newPost = new PostModel({
//         message,
//         posterId,
//         picture: imagePath,
//         likers: [],
//         comments: [],
//       });

//       const savedPost = await newPost.save();
//       res.status(201).json(savedPost);
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({
//         message: "Une erreur est survenue lors de la création du post.",
//         error,
//       });
//     }
//   });
// };

//Fonction pour supprimer un post avec image multer
// module.exports.deletePost = async (req, res) => {
//   const postId = req.params.id;

//   try {
//     // Chercher le post dans la base de données par son ID
//     const postToDelete = await PostModel.findById(postId);

//     // Si le post n'existe pas, retourner une erreur 404
//     if (!postToDelete) {
//       return res.status(404).json({ message: "Post non trouvé" });
//     }

//     // Si le post contient une image, supprimer le fichier de l'image
//     if (postToDelete.picture) {
//       const imagePath = path.join(__dirname, "..", postToDelete.picture);

//       // Vérifier si le fichier existe avant de le supprimer
//       if (fs.existsSync(imagePath)) {
//         fs.unlinkSync(imagePath); // Supprimer l'image
//       } else {
//         console.log("L'image n'existe pas ou a déjà été supprimée.");
//       }
//     }

//     // Supprimer le post de la base de données
//     await PostModel.findByIdAndDelete(postId);

//     // Retourner un message de succès après la suppression
//     res.status(200).json({ message: "Post et image supprimés avec succès." });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       message: "Erreur lors de la suppression du post",
//     });
//   }
// };
