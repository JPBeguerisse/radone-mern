// Chargement des variables d'environnement
require("dotenv").config({ path: "./config/.env" });

// Connexion à la base de données MongoDB
require("./config/db");

const express = require("express");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./swagger"); // Importer la configuration Swagger
const path = require("path");

// Importation des routes
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");
const cors = require("cors");

// Importation des middlewares pour la vérification du token
const { requireAuth, verifyToken } = require("./middlewares/checkToken");

const app = express();

// Configuration CORS pour autoriser les requêtes du front-end
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_CLIENT_URL
      : ["http://localhost:3000", "http://192.168.1.104:3000"], // mobile + dev
  credentials: true,
};
// const corsOptions = {
//   origin: (origin, callback) => {
//     if (
//       !origin || // permet les requêtes sans origin (comme Postman)
//       origin.includes("localhost") ||
//       origin.startsWith("http://192.168.")
//     ) {
//       callback(null, true);
//     } else {
//       console.log("Blocked origin:", origin); // Affiche les appels bloqués

//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true,
// };

//Pour tester sur mon mobile
// app.use(
//   cors({
//     origin: "http://192.168.1.91:3000",
//     credentials: true,
//   })
// );

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Documentation Swagger disponible à /api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Route pour obtenir les informations de l'utilisateur (juste l'id) connecté depuis le token
/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Récupère les informations de l'utilisateur connecté
 *     description: Retourne les informations de l'utilisateur à partir du token JWT envoyé dans le header Authorization.
 *     tags:
 *       - Utilisateur
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Les informations de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: L'identifiant de l'utilisateur
 *                   example: "634578a1f25b2b1f12345678"
 *                 email:
 *                   type: string
 *                   description: L'adresse email de l'utilisateur
 *                   example: "user@example.com"
 *                 firstName:
 *                   type: string
 *                   description: Le prénom de l'utilisateur
 *                   example: "John"
 *                 lastName:
 *                   type: string
 *                   description: Le nom de famille de l'utilisateur
 *                   example: "Doe"
 *       401:
 *         description: Token manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message d'erreur expliquant pourquoi l'utilisateur n'est pas autorisé
 *                   example: "Token manquant"
 *       403:
 *         description: Accès refusé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Token invalide
 *                   example: "Token invalide"
 */
app.get("/api/profile", verifyToken, (req, res) => {
  res.send(req.userId);
});

// Exemple de route
app.get("/api", (req, res) => {
  res.send("Bienvenue sur l'API");
});

// Routes pour les utilisateurs et les posts
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);

// Pour servir les fichiers statiques (images, vidéos, etc.)
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

// Démarrage du serveur
app.listen(process.env.PORT, () => {
  console.log(`Listenning on port ${process.env.PORT}`);
});
