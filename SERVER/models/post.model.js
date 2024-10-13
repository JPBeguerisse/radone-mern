const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    posterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Référence à l'ID de l'utilisateur qui a posté
      required: true,
    },

    description: {
      type: String,
      trim: true, // Retire les espaces superflus en début et fin de texte
      maxLength: 500, // Limite la description à 500 caractères
    },

    picture: {
      type: String, // Stocke l'URL de l'image du post
    },

    likers: {
      type: [String], // Tableau des IDs des utilisateurs qui ont liké
      default: [], // Initialise à un tableau vide
    },

    comments: {
      type: [
        {
          commenterId: {
            type: mongoose.Schema.Types.ObjectId, // Référence à l'ID de l'utilisateur qui a commenté
            ref: "User",
          },
          text: {
            type: String,
            maxLength: 500, // Limite le texte du commentaire à 500 caractères
          },
          timestamp: {
            type: Date, // Utilise le type `Date` pour gérer les dates
            default: Date.now, // Valeur par défaut : date/heure actuelle
          },
        },
      ],
      default: [], // Initialise à un tableau vide par défaut
    },
  },
  {
    timestamps: true, // Active les champs `createdAt` et `updatedAt`
  }
);

const PostModel = mongoose.model("Post", postSchema);

module.exports = PostModel;
