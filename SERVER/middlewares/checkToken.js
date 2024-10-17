const jwt = require("jsonwebtoken");

// Middleware pour vérifier le JWT
module.exports.verifyToken = (req, res, next) => {
  const token = req.header("Authorization"); // Récupérer le token depuis l'en-tête Authorization
  if (!token) {
    return res
      .status(401)
      .json({ message: "Accès refusé. Aucun token fourni." });
  }

  try {
    const verified = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET); // Vérifier le token
    req.user = verified; // Attacher l'utilisateur vérifié à la requête
    next(); // Continuer si tout est bon
  } catch (error) {
    res.status(400).json({ message: "Token invalide" });
  }
};
