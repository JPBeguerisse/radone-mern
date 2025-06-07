require("dotenv").config({ path: "./config/.env" });
require("./config/db");
const express = require("express");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./swagger"); // Importer la configuration Swagger
const path = require("path");

const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");
const cors = require("cors");

const { requireAuth, verifyToken } = require("./middlewares/checkToken");

const app = express();

const corsOption = {
  origin: process.env.REACT_APP_CLIENT_URL,
  credentials: true,
};

//Pour tester sur mon mobile
// app.use(
//   cors({
//     origin: "http://192.168.1.91:3000",
//     credentials: true,
//   })
// );

app.use(cors(corsOption));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuration de Swagger pour servir la documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// router.get("/profile", verifyToken, (req, res) => {
//   res.send(req.userId);
// });

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

app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/uploads", express.static(path.join(__dirname, "uploads"))); // Pour servir les fichiers statiques (images, vidéos, etc.)

app.listen(process.env.PORT, () => {
  console.log(`Listenning on port ${process.env.PORT}`);
});
