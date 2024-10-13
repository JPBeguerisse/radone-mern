const UserModel = require("../models/user.model");

module.exports.signUp = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const user = await UserModel.create({
      firstName,
      lastName,
      email,
      password,
    });
    res.status(201).json({ user: user.id });
    console.log(user);
  } catch (error) {
    res.status(400).json(error);
    console.error("Erreur lors de l'inscription:", error);
  }
};
