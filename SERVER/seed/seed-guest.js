const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const UserModel = require("../models/user.model");

mongoose.connect("mongodb://localhost:27017/rando");

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
