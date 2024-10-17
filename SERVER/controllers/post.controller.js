const PostModel = require("../models/post.model");
const ObjectID = require("mongoose").Types.ObjectId;
const fs = require("fs");
const multer = require("multer");
const path = require("path");

//Fonction pour créer un post
module.exports.createPost = async (req, res) => {
  // Validation de base
  //   if (!message || !posterId) {
  //     return res
  //       .status(400)
  //       .json({ message: "Le message et l'ID du posteur sont obligatoires." });
  //   }

  //GERER L'UPLOAD
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(__dirname, "../uploads/posts");
      console.log("Upload directory:", uploadDir);
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

  // Configuration de multer pour la validation des fichiers
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
  }).single("postImage");

  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({
        message: "Erreur lors de l'upload de l'image.",
        error: err.message,
      });
    }
    try {
      const { posterId, message, video } = req.body;
      const imagePath = req.file ? `/uploads/posts/${req.file.filename}` : null;
      const newPost = new PostModel({
        message,
        posterId,
        picture: imagePath,
        likers: [],
        comments: [],
      });

      const savedPost = await newPost.save();
      res.status(201).json(savedPost);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Une erreur est survenue lors de la création du post.",
      });
    }
  });
};

//Fonction pour récupérer les posts
module.exports.getPosts = async (req, res) => {
  try {
    const posts = await PostModel.find().sort({ createdAt: -1 }); // Trier par date de création;
    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Une erreur est survenue lors de la récupération des posts.",
    });
  }
};

//Fonction pour récupérer un post
module.exports.getPost = async (req, res) => {
  const postId = req.params.id;

  if (!ObjectID.isValid(postId)) {
    return res.status(400).send("ID inconnu : " + postId);
  }

  try {
    const post = await PostModel.findByIdAndUpdate({ _id: postId });
    if (post) res.status(200).json(post);
    else res.status(404).send("Post not found");
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Une erreur est survenue lors de la récupération du post.",
    });
  }
};

// Fonction pour mettre à jour un post existant
module.exports.updatePost = async (req, res) => {
  const postId = req.params.id;
  const { message, picture } = req.body;

  // Vérifier si l'ID du post est valide
  if (!ObjectID.isValid(postId)) {
    return res.status(400).send("ID inconnu : " + postId);
  }

  // Créer un objet updateFields avec uniquement les champs à mettre à jour
  const updateFields = {};
  if (message) updateFields.message = message;
  if (picture) updateFields.picture = picture;

  try {
    // Chercher et mettre à jour le post en utilisant les champs fournis
    const updatedPost = await PostModel.findByIdAndUpdate(
      postId, // ID du post
      { $set: updateFields }, // Champs à mettre à jour
      { new: true } // Renvoie le post mis à jour
    );

    // Si le post est trouvé et mis à jour, renvoyer le document mis à jour
    if (updatedPost) {
      res.status(200).json(updatedPost);
    } else {
      // Si le post n'est pas trouvé, retourner une erreur 404
      res.status(404).send("Post non trouvé");
    }
  } catch (error) {
    // En cas d'erreur, retourner un statut 500 avec un message d'erreur
    console.log(error);
    res.status(500).json({
      message: "Une erreur est survenue lors de la mise à jour du post.",
    });
  }
};

//Fonction pour supprimer un post
module.exports.deletePost = async (req, res) => {
  const postId = req.params.id;

  try {
    // Chercher le post dans la base de données par son ID
    const postToDelete = await PostModel.findById(postId);

    // Si le post n'existe pas, retourner une erreur 404
    if (!postToDelete) {
      return res.status(404).json({ message: "Post non trouvé" });
    }

    // Si le post contient une image, supprimer le fichier de l'image
    if (postToDelete.picture) {
      const imagePath = path.join(__dirname, "..", postToDelete.picture);

      // Vérifier si le fichier existe avant de le supprimer
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath); // Supprimer l'image
      } else {
        console.log("L'image n'existe pas ou a déjà été supprimée.");
      }
    }

    // Supprimer le post de la base de données
    await PostModel.findByIdAndDelete(postId);

    // Retourner un message de succès après la suppression
    res.status(200).json({ message: "Post et image supprimés avec succès." });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Erreur lors de la suppression du post",
    });
  }
};

//Fonction pour liker un post
module.exports.like = async (req, res) => {
  const postId = req.params.id;
  const userId = req.body.userId;

  if (!ObjectID.isValid(userId) || !ObjectID.isValid(postId))
    res.status(404).send("Unknow ID");

  try {
    const liked = await PostModel.findByIdAndUpdate(
      postId,
      {
        $addToSet: {
          //adToset ajoute seulement si l'id n'existe pas déjà
          likers: userId,
        },
      },
      { new: true }
    );

    if (liked) res.status(200).json(liked);
    else res.status(404).send("Post non trouvé");
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Une erreur est survenue lors du like.",
    });
  }
};

// Fonction pour retirer un like d'un post
module.exports.unlike = async (req, res) => {
  const postId = req.params.id; // Récupère l'ID du post à partir des paramètres de l'URL
  const userId = req.body.userId; // Récupère l'ID de l'utilisateur à partir du corps de la requête

  // Vérifier si l'ID du post et l'ID de l'utilisateur sont valides
  if (!ObjectID.isValid(postId) || !ObjectID.isValid(userId)) {
    return res.status(400).send("ID inconnu");
  }

  try {
    // Utiliser $pull pour retirer l'ID de l'utilisateur de la liste des likers
    const unliked = await PostModel.findByIdAndUpdate(
      postId,
      {
        $pull: { likers: userId }, // Retire l'userId du tableau likers
      },
      { new: true }
    );

    // Si le post est trouvé et mis à jour, renvoyer la version mise à jour
    if (unliked) {
      res.status(200).json(unliked);
    } else {
      res.status(404).send("Post non trouvé");
    }
  } catch (error) {
    // En cas d'erreur, retourner un statut 500 avec un message d'erreur
    console.log(error);
    res.status(500).json({
      message: "Une erreur est survenue lors du unlike.",
    });
  }
};

// Fonction pour ajouter un commentaire à un post
module.exports.addCommentPost = async (req, res) => {
  const postId = req.params.id;
  const { text, commenterId } = req.body;

  // Vérifier si l'ID du post et l'ID du commentateur sont valides
  if (!ObjectID.isValid(postId) || !ObjectID.isValid(commenterId)) {
    return res.status(400).send("ID inconnu");
  }

  try {
    // Ajouter un commentaire dans le tableau comments du post
    const updatedPost = await PostModel.findByIdAndUpdate(
      postId,
      {
        $push: {
          comments: {
            commenterId,
            text,
            timestamp: Date.now(),
          },
        },
      },
      { new: true }
    );

    // Si le post est trouvé et mis à jour, retourner le post mis à jour
    if (updatedPost) {
      res.status(200).json(updatedPost);
    } else {
      // Si le post n'est pas trouvé, retourner une erreur 404
      res.status(404).send("Post non trouvé");
    }
  } catch (error) {
    // En cas d'erreur, retourner un statut 500 avec un message d'erreur
    console.log(error);
    res.status(500).json({
      message: "Une erreur est survenue lors de l'ajout du commentaire.",
    });
  }
};

//Fonction pour modifier un commentaire
module.exports.updateComment = async (req, res) => {
  const postId = req.params.id;
  const { commentId, text } = req.body;

  // Vérification de la validité des IDs
  if (!ObjectID.isValid(postId) || !ObjectID.isValid(commentId)) {
    return res.status(400).send("Invalid ID(s)");
  }

  try {
    const updaptedComment = await PostModel.findOneAndUpdate(
      { _id: postId, "comments._id": commentId },
      {
        $set: {
          "comments.$.text": text,
          "comments.$.timestamp": Date.now(),
        },
      },
      { new: true }
    );

    if (updaptedComment) res.status(200).send(updaptedComment);
    else res.status(200).send("Post not found!!!");
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        "Une erreur est survenue lors de la modification du commentaire.",
    });
  }
};

//Fonction pour supprimer un commentaire
module.exports.deleteComment = async (req, res) => {
  const postId = req.params.id;
  const commentId = req.body.commentId;

  try {
    const deletedComment = await PostModel.findByIdAndUpdate(postId, {
      $pull: {
        comments: { _id: commentId },
      },
    });

    if (deletedComment)
      res.status(200).json({ message: "Successfully deleted comment." });
    else res.status(404).send("Comment not found");
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Une erreur est survenue lors de la suppression du commentaire.",
    });
  }
};
