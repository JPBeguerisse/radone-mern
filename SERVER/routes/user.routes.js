//user.routes.js
const router = require("express").Router();
const authController = require("../controllers/auth.controller");

/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur
 *     description: Créer un nouvel utilisateur avec son prénom, nom, email et mot de passe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Erreur dans les données envoyées
 */
router.post("/register", authController.signUp);

module.exports = router;
