const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const UserModel = require("../models/user.model");
require("dotenv").config({ path: "../.env.development" });
console.log("MONGO_URL utilisé:", process.env.MONGO_URL); // ⚠️ doit afficher une URL

mongoose
  .connect(process.env.MONGO_URL, {
    dbName: "social-network",
  })
  .then(() =>
    console.log("Connexion à MongoDB réussie !", process.env.MONGO_URL)
  )
  .catch((error) =>
    console.error("Erreur de connexion à MongoDB :", error.message)
  );

(async () => {
  const hashedPassword = await bcrypt.hash("motdepasseinvité", 10);

  const guestUser = new UserModel({
    name: "Visiteur",
    userName: "guest_user",
    email: "guest@example.com",
    password: hashedPassword,
    isGuest: true,
    picture: "/random-user.jpeg",
  });

  await guestUser.save();
  //console.log("Compte invité créé !");
  mongoose.disconnect();
})();
