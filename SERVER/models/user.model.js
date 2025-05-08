const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 25,
      trim: true,
    },

    userName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 25,
      trim: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      validate: [isEmail, "Invalid email"], // Ajout d'un message d'erreur
      lowercase: true,
      trim: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      maxLength: 1024,
      minLength: 6,
    },

    bio: {
      type: String,
      max: 1024,
    },

    picture: {
      type: String,
      default: "./uploads/profil/random-user.jpeg",
    },

    followers: {
      type: [mongoose.Schema.Types.ObjectId], // Tableau d'IDs des utilisateurs qui ont suive ce user
      ref: "User",
      default: [],
    },
    following: {
      type: [mongoose.Schema.Types.ObjectId], // Tableau d'IDs des utilisateurs qui ont enregistré le post
      ref: "User",
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Hook pour hasher le mot de passe avant de le sauvegarder
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, salt);
  }

  next();
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
