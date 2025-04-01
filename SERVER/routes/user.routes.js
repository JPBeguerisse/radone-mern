//user.routes.js
const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const uploadController = require("../controllers/upload.controller");
const userController = require("../controllers/user.controller");
const { verifyToken, requireAuth } = require("../middlewares/checkToken");

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *           example: "Alex"
 *         userName:
 *           type: string
 *           example: "Martin"
 *         profilName:
 *           type: string
 *           example: "alexm"
 *         email:
 *           type: string
 *           format: email
 *           example: "alex.martin@example.com"
 *         password:
 *           type: string
 *           format: password
 *           example: "$2b$10$hashedvalue..."
 *         bio:
 *           type: string
 *           example: "Passionné de randonnée et de nature"
 *         picture:
 *           type: string
 *           example: "./uploads/profil/random-user.png"
 *         likes:
 *           type: array
 *           items:
 *             type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

//AUTH
/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Authentifier un utilisateur
 *     description: Authentifie un utilisateur en vérifiant son email et son mot de passe. Si l'authentification réussit, un token JWT est renvoyé.
 *     tags:
 *       - Authentification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: L'adresse email de l'utilisateur
 *                 example: utilisateur@example.com
 *               password:
 *                 type: string
 *                 description: Le mot de passe de l'utilisateur
 *                 example: MotDePasse123
 *     responses:
 *       200:
 *         description: Authentification réussie, renvoie le token JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT renvoyé pour l'authentification
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Mot de passe incorrect
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur lors de l'authentification
 */
router.post("/login", authController.login);

//DECONNEXION
/**
 * @swagger
 * /api/user/logout:
 *   post:
 *     summary: Déconnexion de l'utilisateur
 *     description: Cette route permet à l'utilisateur de se déconnecter. Aucun token n'est nécessaire pour cette route, elle renvoie simplement un message confirmant la déconnexion.
 *     tags:
 *       - Authentification
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Déconnexion réussie.
 */
router.post("/logout", authController.logout);

//S'INSCRIRE - CREATE
/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur
 *     description: Créer un nouvel utilisateur avec son prénom, nom, email, et mot de passe. La fonction vérifie que tous les champs sont remplis, que le mot de passe a au moins 6 caractères et que l'email n'existe pas déjà dans la base de données.
 *     tags:
 *       - Authentification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Le prénom de l'utilisateur
 *                 example: Jean
 *               userName:
 *                 type: string
 *                 description: Le nom de famille de l'utilisateur
 *                 example: Dupont
 *               email:
 *                 type: string
 *                 description: L'adresse email de l'utilisateur
 *                 example: jean@example.com
 *               password:
 *                 type: string
 *                 description: Le mot de passe de l'utilisateur
 *                 example: MotDePasse123
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: string
 *                   description: ID de l'utilisateur nouvellement créé
 *       400:
 *         description: Erreur de validation ou email déjà existant
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message d'erreur détaillant la cause de l'échec
 *                   example: "Tous les champs sont requis ou Le mot de passe doit contenir au moins 6 caractères"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message d'erreur pour une erreur serveur
 *                   example: "Erreur lors de l'inscription"
 */
router.post("/register", authController.signUp);

//RECUPERER LES USERS
/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Récupérer tous les utilisateurs
 *     description: Récupère une liste de tous les utilisateurs, sans leur mot de passe.
 *     tags:
 *       - Utilisateurs
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID de l'utilisateur
 *                   name:
 *                     type: string
 *                     description: Prénom de l'utilisateur
 *                   userName:
 *                     type: string
 *                     description: Nom de l'utilisateur
 *                   email:
 *                     type: string
 *                     description: Email de l'utilisateur
 *       500:
 *         description: Erreur interne du serveur
 */
router.get("/", userController.getUsers);

//RECUPERER LES INFOS D'UN USER
/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     summary: Récupérer un utilisateur par son ID
 *     description: Récupère les informations d'un utilisateur spécifique en utilisant son ID, sans renvoyer son mot de passe.
 *     tags:
 *       - Utilisateurs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de l'utilisateur à récupérer
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Informations de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: ID de l'utilisateur
 *                 name:
 *                   type: string
 *                   description: Prénom de l'utilisateur
 *                 userName:
 *                   type: string
 *                   description: Nom de l'utilisateur
 *                 email:
 *                   type: string
 *                   description: Email de l'utilisateur
 *       400:
 *         description: Utilisateur non trouvé ou ID invalide
 *       500:
 *         description: Erreur interne du serveur
 */
router.get("/:id", verifyToken, userController.getUser);

/**
 * @swagger
 * /api/user/{id}:
 *   put:
 *     summary: Met à jour les informations d'un utilisateur
 *     description: |
 *       Cette route permet de mettre à jour les informations d'un utilisateur, y compris son mot de passe s'il fournit l'ancien et le nouveau.
 *       - Le mot de passe doit être robuste (majuscule, minuscule, chiffre, caractère spécial).
 *       - L'ancien mot de passe doit être fourni pour le changer.
 *     tags:
 *       - Utilisateur
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID de l'utilisateur à modifier
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Jean"
 *               userName:
 *                 type: string
 *                 example: "jean_doe"
 *               email:
 *                 type: string
 *                 example: "jean@example.com"
 *               bio:
 *                 type: string
 *                 example: "Développeur passionné par le JS."
 *               oldPassword:
 *                 type: string
 *                 example: "AncienPass123!"
 *               newPassword:
 *                 type: string
 *                 example: "NouveauPass@2024"
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Requête invalide ou données déjà utilisées
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cette adresse email est déjà utilisée."
 *       404:
 *         description: Utilisateur introuvable
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Utilisateur non trouvé."
 *       500:
 *         description: Erreur serveur
 */
router.patch("/:id", userController.updateUser);

/**
 * @swagger
 * /api/user/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur
 *     description: Supprime un utilisateur en utilisant son ID. Renvoie un message de succès et les détails de l'utilisateur supprimé si tout se passe bien.
 *     tags:
 *       - Utilisateurs
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de l'utilisateur à supprimer
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message confirmant la suppression de l'utilisateur
 *                 user:
 *                   type: object
 *                   description: Détails de l'utilisateur supprimé
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: ID de l'utilisateur
 *                     name:
 *                       type: string
 *                       description: Prénom de l'utilisateur
 *                     userName:
 *                       type: string
 *                       description: Nom de l'utilisateur
 *                     email:
 *                       type: string
 *                       description: Email de l'utilisateur
 *       400:
 *         description: ID invalide ou incorrect
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur interne du serveur lors de la suppression de l'utilisateur
 */
router.delete("/:id", userController.deleteUser);

/**
 * @swagger
 * /api/user/upload-profil:
 *   post:
 *     summary: Uploader une image de profil pour un utilisateur
 *     description: Permet de mettre à jour l'image de profil d'un utilisateur. Si une image de profil existe déjà, elle sera supprimée et remplacée par la nouvelle.
 *     tags:
 *       - Utilisateurs
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profileImage:
 *                 type: string
 *                 format: binary
 *                 description: Une image au format PNG, JPG ou JPEG, ne dépassant pas 500 Ko
 *               userId:
 *                 type: string
 *                 description: L'ID de l'utilisateur qui met à jour son profil
 *                 example: "614d6f1c3a6b3f456abc1234"
 *     responses:
 *       200:
 *         description: Image de profil uploadée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Image uploadée avec succès."
 *                 user:
 *                   type: object
 *                   description: Informations mises à jour de l'utilisateur
 *       404:
 *         description: Utilisateur non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Utilisateur non trouvé."
 *       500:
 *         description: Erreur lors de l'upload de l'image ou de la mise à jour du profil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erreur lors de l'upload du fichier."
 *                 errors:
 *                   type: object
 *                   description: Détails des erreurs
 */
router.post("/upload-profil", uploadController.uploadProfil);

/**
 * @swagger
 * /api/user/remove-profil-picture/{id}:
 *   delete:
 *     summary: Supprimer l'image de profil d'un utilisateur
 *     description: Supprime physiquement le fichier image de l'utilisateur ainsi que la référence dans la base de données.
 *     tags:
 *       - Utilisateurs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'identifiant de l'utilisateur
 *         example: "614d6f1c3a6b3f456abc1234"
 *     responses:
 *       200:
 *         description: Photo de profil supprimée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "614d6f1c3a6b3f456abc1234"
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 picture:
 *                   type: string
 *                   example: ""
 *                 # ... ajoute ici les autres champs que tu renvoies dans ton user
 *       404:
 *         description: Utilisateur non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Utilisateur non trouvé"
 *       500:
 *         description: Erreur serveur lors de la suppression de la photo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erreur lors de la suppression de la photo"
 */
router.delete("/remove-profil-picture/:id", uploadController.removePicture);

module.exports = router;
