//user.routes.js
const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const uploadController = require("../controllers/upload.controller");
const userController = require("../controllers/user/user.controller");
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

//CONFIRMATION EMAIL
router.get("/confirm-email/:token", authController.confirmEmail);

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

// mot de passe oublié
/**
 * @swagger
 * /api/user/forgot-password:
 *   post:
 *     summary: Mot de passe oublié
 *     description: Envoie un e-mail avec un lien de réinitialisation du mot de passe à l'utilisateur.
 *     tags:
 *       - Authentification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: L'adresse email de l'utilisateur pour lequel le mot de passe doit être réinitialisé.
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: E-mail envoyé avec succès
 *       404:
 *         description: Aucun compte trouvé
 *       500:
 *         description: Erreur lors de l'envoi de l'e-mail
 */
router.post("/forgot-password", authController.forgotPassword);

//REINITIALISATION DU MOT DE PASSE
/**
 /**
 * @swagger
 * /api/user/reset-password/{token}:
 *   post:
 *     summary: Réinitialiser le mot de passe
 *     description: Réinitialise le mot de passe de l'utilisateur en utilisant un token de réinitialisation.
 *     tags:
 *       - Authentification
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: Le token de réinitialisation du mot de passe envoyé par email.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *                 description: Le nouveau mot de passe de l'utilisateur.
 *                 example: NouveauMotDePasse123!
 *     responses:
 *       200:
 *         description: Mot de passe réinitialisé avec succès
 *       400:
 *         description: Token invalide ou expiré
 *       500:
 *         description: Erreur lors de la réinitialisation du mot de passe
 */
router.post("/reset-password/:token", authController.resetPassword);

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

// Récupérer les followers et following d'un utilisateur
/**
 * @swagger
 * /api/user/{userId}/followers:
 *   get:
 *     summary: Récupérer les followers d'un utilisateur
 *     description: Récupère la liste des utilisateurs qui suivent un utilisateur spécifique en excluant leurs mots de passe.
 *     tags:
 *       - Utilisateurs
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID de l'utilisateur dont on veut récupérer les followers
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des followers de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID du follower
 *                   name:
 *                     type: string
 *                     description: Prénom du follower
 *                   userName:
 *                     type: string
 *                     description: Nom d'utilisateur du follower
 *                   email:
 *                     type: string
 *                     description: Email du follower
 *       400:
 *         description: ID de l'utilisateur invalide
 *       500:
 *         description: Erreur interne du serveur
 */
router.get("/followers", verifyToken, userController.getFollowers);

// Récupérer les utilisateurs suivis par un utilisateur
/**
 * @swagger
 * /api/user/{userId}/following:
 *   get:
 *     summary: Récupérer les utilisateurs suivis par un utilisateur
 *     description: Récupère la liste des utilisateurs que suit un utilisateur spécifique en excluant leurs mots de passe.
 *     tags:
 *       - Utilisateurs
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID de l'utilisateur dont on veut récupérer les abonnements
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des utilisateurs suivis par l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID de l'utilisateur suivi
 *                   name:
 *                     type: string
 *                     description: Prénom de l'utilisateur suivi
 *                   userName:
 *                     type: string
 *                     description: Nom d'utilisateur de l'utilisateur suivi
 *                   email:
 *                     type: string
 *                     description: Email de l'utilisateur suivi
 *       400:
 *         description: ID de l'utilisateur invalide
 *       500:
 *         description: Erreur interne du serveur
 */
router.get("/following", verifyToken, userController.getFollowing);

// Rechercher des utilisateurs
/**
 * @swagger
 * /api/user/search:
 *   get:
 *     summary: Rechercher des utilisateurs
 *     description: Recherche des utilisateurs par nom ou nom d'utilisateur (userName).
 *     tags:
 *       - Utilisateurs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: query
 *         in: query
 *         required: true
 *         description: Terme de recherche (nom ou nom d'utilisateur)
 *         schema:
 *           type: string
 *           example: john
 *     responses:
 *       200:
 *         description: Liste des utilisateurs correspondant à la recherche
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
 *                     description: Nom d'utilisateur
 *                   picture:
 *                     type: string
 *                     description: URL de la photo de profil
 *       400:
 *         description: Terme de recherche vide ou invalide
 *       500:
 *         description: Erreur interne du serveur
 */
router.get("/search", verifyToken, userController.searchUsers);

//RECUPERER LES INFOS D'UN USER
/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     summary: Récupérer un utilisateur par son ID
 *     description: Récupère les informations d'un utilisateur spécifique en utilisant son ID, sans renvoyer son mot de passe.
 *     tags:
 *       - Utilisateur
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

//RECUPERER LES INFOS D'UN USER PAR USERNAME
/**
 * @swagger
 * /api/user/by-username/{userName}:
 *   get:
 *     summary: Récupérer un utilisateur par son username
 *     description: Récupère les informations d'un utilisateur spécifique en utilisant son username, sans renvoyer son mot de passe.
 *     tags:
 *       - Utilisateurs
 *     parameters:
 *       - name: userName
 *         in: path
 *         required: true
 *         description: Nom d'utilisateur unique (userName) à rechercher
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Informations de l'utilisateur récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: ID unique de l'utilisateur
 *                 name:
 *                   type: string
 *                   description: Prénom de l'utilisateur
 *                 userName:
 *                   type: string
 *                   description: Nom d'utilisateur unique
 *                 email:
 *                   type: string
 *                   description: Adresse email de l'utilisateur
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.get("/by-username/:username", userController.getUserByUsername);

//UPDATE USER
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
 *     security:
 *       - bearerAuth: []
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
router.put("/:id", verifyToken, userController.updateUser);

//DELETE USER
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
router.delete("/", verifyToken, userController.deleteUser);

// UPLOAD USER PICTURE
/**
 * @swagger
 * /api/user/update-profil-picture:
 *   put:
 *     summary: Mettre à jour la photo de profil de l'utilisateur
 *     description: Met à jour la photo de profil d'un utilisateur avec une nouvelle URL (Cloudinary par exemple).
 *     tags:
 *       - Utilisateurs
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - picture
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID de l'utilisateur
 *               picture:
 *                 type: string
 *                 description: URL de la nouvelle image de profil
 *     responses:
 *       200:
 *         description: Photo de profil mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put(
  "/update/profil-picture",
  verifyToken,
  uploadController.updatePicture
);

//Supprimer l'image de profil d'un utilisateur
/**
 * @swagger
 * /api/user/delete-profil-picture/{id}:
 *   put:
 *     summary: Supprimer la photo de profil de l'utilisateur
 *     description: Réinitialise la photo de profil d'un utilisateur en la remplaçant par une image par défaut.
 *     tags:
 *       - Utilisateurs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de l'utilisateur
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Photo de profil supprimée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put(
  "/delete-profil-picture/:id",
  verifyToken,
  uploadController.removeProfilePicture
);

// UPLOAD USER PROFILE PICTURE
/**
 * @swagger
 * /api/user/upload-profil:
 *   post:
 *     summary: Uploader une image de profil pour un utilisateur
 *     description: Permet de mettre à jour l'image de profil d'un utilisateur. Si une image de profil existe déjà, elle sera supprimée et remplacée par la nouvelle.
 *     tags:
 *       - Utilisateurs
 *     security:
 *      - bearerAuth: []
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
//router.post("/upload-profil", verifyToken, uploadController.uploadProfil);

// REMOVE USER PROFILE PICTURE
/**
 * @swagger
 * /api/user/remove-profil-picture/{id}:
 *   delete:
 *     summary: Supprimer l'image de profil d'un utilisateur
 *     description: Supprime physiquement le fichier image de l'utilisateur ainsi que la référence dans la base de données.
 *     tags:
 *       - Utilisateur
 *     security:
 *       - bearerAuth: []
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
// router.delete(
//   "/remove-profil-picture/:id",
//   verifyToken,
//   uploadController.removePicture
// );

// FOLLOW / UNFOLLOW USER
/**
 * @swagger
 * /api/user/follow/{id}:
 *   put:
 *     summary: Suivre un utilisateur
 *     description: Ajoute l'utilisateur `userIdToFollow` à la liste des abonnements (`following`) de l'utilisateur `id`, et met à jour les followers de l'autre utilisateur.
 *     tags:
 *       - Utilisateur
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID de l'utilisateur qui souhaite suivre quelqu'un
 *         example: "614d6f1c3a6b3f456abc1234"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userIdToFollow:
 *                 type: string
 *                 description: L'ID de l'utilisateur à suivre
 *                 example: "614d6f1c3a6b3f456abc4321"
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour après avoir suivi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: ID invalide
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "614d6f1c3a6b3f456abc1234"
 *       404:
 *         description: Utilisateur non trouvé
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: User not found
 *       500:
 *         description: Erreur serveur lors du suivi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Une erreur est survenue lors du follow.
 */
router.put("/follow/:id", verifyToken, userController.follow);

// UNFOLLOW USER
/**
 * @swagger
 * /api/user/unfollow/{id}:
 *   put:
 *     summary: Se désabonner d’un utilisateur
 *     description: Supprime `userIdToUnFollow` de la liste des abonnements de l’utilisateur `id`, et retire également `id` de la liste des followers de l’autre utilisateur.
 *     tags:
 *       - Utilisateur
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID de l'utilisateur qui veut se désabonner
 *         example: "614d6f1c3a6b3f456abc1234"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userIdToUnFollow:
 *                 type: string
 *                 description: L'ID de l'utilisateur à ne plus suivre
 *                 example: "614d6f1c3a6b3f456abc4321"
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour après désabonnement
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: ID invalide
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "614d6f1c3a6b3f456abc1234"
 *       404:
 *         description: Utilisateur non trouvé
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: User not found
 *       500:
 *         description: Erreur serveur lors du désabonnement
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Une erreur est survenue lors du follow.
 */
router.put("/unfollow/:id", verifyToken, userController.unfollow);
module.exports = router;

//se connecter en tant qu'invité
/**
 * @swagger
 * /api/user/login-guest:
 *   post:
 *     summary: Connexion en tant qu'invité
 *     description: Permet à un utilisateur de se connecter en tant qu'invité. Renvoie un token JWT pour l'authentification.
 *     tags:
 *       - Authentification
 *     responses:
 *       200:
 *         description: Connexion réussie, renvoie le token JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT pour l'authentification de l'invité
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       404:
 *         description: Utilisateur invité introuvable
 */
router.post("/login-guest", authController.loginGuest);

// Récupérer les follwers d'un utilisateur
/**
 * @swagger
 * /api/user/{userId}/followers:
 *   get:
 *     summary: Récupérer les followers d'un utilisateur
 *     description: Récupère la liste des utilisateurs qui suivent un utilisateur spécifique en excluant leurs mots de passe.
 *     tags:
 *       - Utilisateurs
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID de l'utilisateur dont on veut récupérer les followers
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des followers de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID du follower
 *                   name:
 *                     type: string
 *                     description: Prénom du follower
 *                   userName:
 *                     type: string
 *                     description: Nom d'utilisateur du follower
 */
router.get("/:id/followers", verifyToken, userController.getProfileFollowers);

// Récupérer les utilisateurs suivis par un utilisateur
/**
 * @swagger
 * /api/user/{userId}/following:
 *   get:
 *     summary: Récupérer les utilisateurs suivis par un utilisateur
 *     description: Récupère la liste des utilisateurs que suit un utilisateur spécifique en excluant leurs mots de passe.
 *     tags:
 *       - Utilisateurs
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID de l'utilisateur dont on veut récupérer les abonnements
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des utilisateurs suivis par l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID de l'utilisateur suivi
 *                   name:
 *                     type: string
 *                     description: Prénom de l'utilisateur suivi
 *                   userName:
 *                     type: string
 *                     description: Nom d'utilisateur de l'utilisateur suivi
 */
router.get("/:id/following", verifyToken, userController.getProfileFollowing);

// récupérer les utilisateurs archivés
/**
 * @swagger
 * /api/user/archived:
 *   get:
 *     summary: Récupérer les utilisateurs archivés
 *     description: Récupère la liste des utilisateurs archivés.
 *     tags:
 *       - Utilisateurs
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs archivés
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID de l'utilisateur archivé
 *                   name:
 *                     type: string
 *                     description: Prénom de l'utilisateur archivé
 */
router.get("/archived", verifyToken, userController.getArchivedUsers);
