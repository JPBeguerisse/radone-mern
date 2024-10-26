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
    req.userId = verified.id; // Attacher l'utilisateur juste l'id de l'utilisateur vérifié à la requête

    next(); // Continuer si tout est bon
  } catch (error) {
    res.status(400).json({ message: "Token invalide" });
  }
};

// module.exports.requireAuth = (req, res, next) => {
//   // Récupérer le token depuis les cookies ou l'en-tête Authorization
//   const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];

//   // Vérifier si le token est présent
//   if (token) {
//     try {
//       // Vérifier et décoder le token
//       const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
//       console.log(decodedToken.id); // Affiche l'ID de l'utilisateur pour le débogage

//       // Ajouter les informations du token à l'objet req pour les routes suivantes
//       req.userId = decodedToken.id;

//       // Passer au middleware suivant ou à la route
//       next();
//     } catch (error) {
//       // Si le token est invalide ou expiré
//       res
//         .status(401)
//         .json({ message: "Unauthorized: Invalid or expired token" });
//     }
//   } else {
//     // Si aucun token n'est fourni
//     res.status(401).json({ message: "Unauthorized: No token provided" });
//   }
// };
