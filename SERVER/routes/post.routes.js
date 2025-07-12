const router = require("express").Router();
const postController = require("../controllers/post/post.controller");
const { verifyToken, requireAuth } = require("../middlewares/checkToken");

/**
 * @swagger
 * components:
 *  securitySchemes:
 *   bearerAuth:
 *    type: http
 *    scheme: bearer
 *    bearerFormat: JWT
 *  schemas:
 *     Post:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         posterId:
 *           type: string
 *         message:
 *           type: string
 *         picture:
 *           type: string
 *         likers:
 *           type: array
 *           items:
 *             type: string
 *         savedBy:
 *           type: array
 *           items:
 *             type: string
 *         comments:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *               commenterId:
 *                 type: string
 *               text:
 *                 type: string
 *               likers:
 *                 type: array
 *                 items:
 *                   type: string
 *               replies:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     replierId:
 *                       type: string
 *                     text:
 *                       type: string
 *                     likers:
 *                       type: array
 *                       items:
 *                         type: string
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

//CREATION DE POST
/**
 * @swagger
 * /api/post:
 *   post:
 *     summary: Créer un nouveau post avec upload d'image
 *     description: Permet de créer un nouveau post en ajoutant un message, une image, une vidéo, et l'ID du posteur.
 *     tags:
 *       - Posts
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               posterId:
 *                 type: string
 *                 description: L'ID de l'utilisateur créant le post
 *                 example: 614d6f1c3a6b3f456abc1234
 *               message:
 *                 type: string
 *                 description: Le contenu textuel du post
 *                 example: "Voici un nouveau post"
 *               video:
 *                 type: string
 *                 description: L'URL de la vidéo à inclure dans le post (facultatif)
 *                 example: "https://video.com/1234"
 *               postImage:
 *                 type: string
 *                 format: binary
 *                 description: Une image pour le post (PNG, JPG, JPEG, max 500 Ko)
 *     responses:
 *       201:
 *         description: Post créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  post:
 *                   $ref: '#/components/schemas/Post'
 *       400:
 *         description: Erreur lors de la création du post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erreur lors de la création du post"
 *                 error:
 *                   type: string
 *                   example: "Description de l'erreur"
 *       500:
 *         description: Erreur lors de l'upload de l'image
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erreur lors de l'upload de l'image"
 *                 error:
 *                   type: string
 *                   example: "Description de l'erreur"
 */
router.post("/", verifyToken, postController.createPost);
//RECUPERATION DES POSTS
/**
 * @swagger
 * /api/post:
 *   get:
 *     summary: Récupérer tous les posts
 *     description: Cette route permet de récupérer la liste de tous les posts dans la base de données.
 *     tags:
 *       - Posts
 *     responses:
 *       200:
 *         description: Liste de tous les posts récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                    post:
 *                      $ref: '#/components/schemas/Post'
 *       500:
 *         description: Erreur interne du serveur lors de la récupération des posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Une erreur est survenue lors de la récupération des posts."
 */
router.get("/post-old", postController.getPosts);

/**
 * @swagger
 * /api/post:
 *   get:
 *     summary: Récupérer les posts avec pagination
 *     description: Récupère une liste de posts triés par date de création (les plus récents d'abord), avec des paramètres de pagination `limit` et `skip`.
 *     tags:
 *       - Posts
 *     parameters:
 *       - name: limit
 *         in: query
 *         description: Nombre maximum de posts à retourner
 *         required: false
 *         schema:
 *           type: integer
 *           example: 5
 *       - name: skip
 *         in: query
 *         description: Nombre de posts à ignorer (utile pour la pagination)
 *         required: false
 *         schema:
 *           type: integer
 *           example: 0
 *     responses:
 *       200:
 *         description: Liste des posts récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   message:
 *                     type: string
 *                   picture:
 *                     type: string
 *                   posterId:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Erreur lors du chargement des posts
 */
router.get("/", verifyToken, postController.getPosts);

/**
 * @swagger
 * /api/post/following/{id}:
 *   get:
 *     summary: Récupérer les posts des utilisateurs suivis
 *     description: |
 *       Récupère tous les posts des utilisateurs suivis par l'utilisateur donné (triés du plus récent au plus ancien).
 *     tags:
 *       - Posts
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID de l'utilisateur connecté
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des posts des utilisateurs suivis
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   message:
 *                     type: string
 *                   picture:
 *                     type: string
 *                   posterId:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                   comments:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         text:
 *                           type: string
 *                         timestamp:
 *                           type: string
 *       400:
 *         description: ID invalide
 *       500:
 *         description: Erreur serveur
 */
router.get("/following/:id", verifyToken, postController.getPostsFollowing);

/**
 * @swagger
 * /api/post/for-you/{id}:
 *   get:
 *     summary: Récupérer les posts des utilisateurs non suivis ("Pour toi")
 *     description: |
 *       Récupère les posts des utilisateurs que l'utilisateur connecté ne suit pas.
 *       Cela permet de générer un fil d’actualité de type "Pour toi".
 *     tags:
 *       - Posts
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID de l'utilisateur connecté
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des posts "pour toi"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   message:
 *                     type: string
 *                   picture:
 *                     type: string
 *                   posterId:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                   comments:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         text:
 *                           type: string
 *                         timestamp:
 *                           type: string
 *       400:
 *         description: ID invalide
 *       500:
 *         description: Erreur serveur
 */
router.get("/for-you/:id", verifyToken, postController.getPostsForYou);

//RECUPERER UN POST
/**
 * @swagger
 * /api/post/{id}:
 *   get:
 *     summary: Récupérer un post spécifique par ID
 *     description: Cette route permet de récupérer un post en particulier à partir de son ID.
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID du post à récupérer
 *     responses:
 *       200:
 *         description: Post récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  post:
 *                   $ref: '#/components/schemas/Post'
 *       404:
 *         description: Le post n'a pas été trouvé
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Post non trouvé"
 *       500:
 *         description: Erreur interne du serveur lors de la récupération du post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Une erreur est survenue lors de la récupération du post."
 */
router.get("/:id", verifyToken, postController.getPost);

//RECUPERER UN POST PAR USERNAME
/**
 * @swagger
 * /api/post/user/{username}:
 *   get:
 *     summary: Récupérer les posts d'un utilisateur par son username
 *     description: Récupère tous les posts publiés par un utilisateur identifié par son nom d'utilisateur.
 *     tags:
 *       - Posts
 *     parameters:
 *       - name: username
 *         in: path
 *         required: true
 *         description: Nom d'utilisateur (username) de l'auteur des posts
 *         schema:
 *           type: string
 *           example: johndoe
 *     responses:
 *       200:
 *         description: Liste des posts de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   message:
 *                     type: string
 *                   picture:
 *                     type: string
 *                   posterId:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.get("/user/:username", verifyToken, postController.getPostsByUsername);

//RECUPERER UN POST PAR USER ID
/**
 * @swagger
 * /api/post/user-profil/{id}:
 *   get:
 *     summary: Récupérer les posts d'un utilisateur avec ses commentaires triés
 *     description: |
 *       Récupère tous les posts créés par un utilisateur spécifique en utilisant son identifiant (`userId`).
 *       Les posts sont triés par date de création décroissante, et les commentaires dans chaque post sont triés du plus récent au plus ancien.
 *     tags:
 *       - Posts
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID unique de l'utilisateur
 *         schema:
 *           type: string
 *           example: 661cba70c1f44613f8d273b4
 *     responses:
 *       200:
 *         description: Liste des posts avec commentaires triés
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   message:
 *                     type: string
 *                   picture:
 *                     type: string
 *                   posterId:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   comments:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         commenterId:
 *                           type: string
 *                         text:
 *                           type: string
 *                         timestamp:
 *                           type: string
 *                           format: date-time
 *       400:
 *         description: ID utilisateur invalide
 *       404:
 *         description: Utilisateur introuvable
 *       500:
 *         description: Erreur interne lors de la récupération des posts
 */
router.get("/user-profil/:id", verifyToken, postController.getPostsUser);

//RECUPERER LES POSTS SAUVES
/**
 * @swagger
 * /api/post/saved/{id}:
 *   get:
 *     summary: Récupérer les posts enregistrés par un utilisateur
 *     description: Récupère tous les posts que l'utilisateur a enregistrés dans ses favoris (`savedBy`), triés par date de création décroissante.
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID unique de l'utilisateur
 *         schema:
 *           type: string
 *           example: 661cba70c1f44613f8d273b4
 *     responses:
 *       200:
 *         description: Liste des posts enregistrés récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   message:
 *                     type: string
 *                   picture:
 *                     type: string
 *                   posterId:
 *                     type: string
 *                   savedBy:
 *                     type: array
 *                     items:
 *                       type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       400:
 *         description: ID invalide
 *       500:
 *         description: Erreur interne lors de la récupération des posts enregistrés
 */
router.get("/saved/:id", verifyToken, postController.getSavedPosts);

//MODIFIER UN POST
/**
 * @swagger
 * /api/post/{id}:
 *   put:
 *     summary: Mettre à jour un post spécifique par ID
 *     description: Cette route permet de mettre à jour un post en particulier à partir de son ID. Les champs modifiables incluent le message et l'URL de l'image.
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID du post à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: Le message du post (facultatif)
 *                 example: Nouveau contenu du post
 *               picture:
 *                 type: string
 *                 description: L'URL de l'image associée au post (facultatif)
 *                 example: https://exemple.com/nouvelle-image.jpg
 *     responses:
 *       200:
 *         description: Post mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  post:
 *                   $ref: '#/components/schemas/Post'
 *       400:
 *         description: Erreur de validation de l'ID ou données manquantes
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "ID inconnu"
 *       404:
 *         description: Le post n'a pas été trouvé
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Post non trouvé"
 *       500:
 *         description: Erreur interne du serveur lors de la mise à jour du post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Une erreur est survenue lors de la mise à jour du post."
 */
router.put("/:id", verifyToken, postController.updatePost);

//SUPPRIMER UN POST
/**
 * @swagger
 * /api/post/{id}:
 *   delete:
 *     summary: Supprimer un post et son image associée
 *     description: Supprime un post à partir de son ID ainsi que l'image associée, si elle existe.
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID du post à supprimer
 *     responses:
 *       200:
 *         description: Post et image supprimés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Post et image supprimés avec succès."
 *       404:
 *         description: Post non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Post non trouvé"
 *       500:
 *         description: Erreur interne du serveur lors de la suppression du post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erreur lors de la suppression du post"
 */
router.delete("/:id", verifyToken, postController.deletePost);

//LIKER UN POST
/**
 * @swagger
 * /api/post/like/{id}:
 *   patch:
 *     summary: Liker un post
 *     description: Permet à un utilisateur de liker un post en ajoutant son ID à la liste des likers.
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID du post à liker
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: L'ID de l'utilisateur qui like le post
 *                 example: 614d6f1c3a6b3f456abc1234
 *     responses:
 *       200:
 *         description: Post liké avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 post:
 *                   $ref: '#/components/schemas/Post'
 *       400:
 *         description: IDs invalides
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "ID inconnu"
 *       404:
 *         description: Le post n'a pas été trouvé
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Post non trouvé"
 *       500:
 *         description: Erreur interne du serveur lors de l'ajout du like
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Une erreur est survenue lors du like."
 */
router.patch("/like/:id", verifyToken, postController.like);

//UNLIKER UN POST
/**
 * @swagger
 * /api/post/unlike/{id}:
 *   patch:
 *     summary: Retirer un like d'un post
 *     description: Permet à un utilisateur de retirer son like d'un post en supprimant son ID de la liste des likers.
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID du post dont le like sera retiré
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                post:
 *                   $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: Like retiré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: L'ID du post mis à jour
 *                 likers:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Liste des utilisateurs ayant liké le post après le retrait du like
 *       400:
 *         description: IDs invalides
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "ID inconnu"
 *       404:
 *         description: Le post n'a pas été trouvé
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Post non trouvé"
 *       500:
 *         description: Erreur interne du serveur lors du retrait du like
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Une erreur est survenue lors du unlike."
 */
router.patch("/unlike/:id", verifyToken, postController.unlike);

//ADDCOMMENT
/**
 * @swagger
 * /api/post/add-comment/{id}:
 *   patch:
 *     summary: Ajouter un commentaire à un post
 *     description: Permet à un utilisateur d'ajouter un commentaire à un post.
 *     tags:
 *       - Commentaires
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID du post auquel ajouter un commentaire
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                post:
 *                   $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: Commentaire ajouté avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: L'ID du post mis à jour
 *                 comments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       commenterId:
 *                         type: string
 *                         description: L'ID de l'utilisateur qui a commenté
 *                       text:
 *                         type: string
 *                         description: Le texte du commentaire
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *                         description: La date et l'heure du commentaire
 *       400:
 *         description: IDs invalides
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "ID inconnu"
 *       404:
 *         description: Le post n'a pas été trouvé
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Post non trouvé"
 *       500:
 *         description: Erreur interne du serveur lors de l'ajout du commentaire
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Une erreur est survenue lors de l'ajout du commentaire."
 */
router.put("/add-comment/:id", verifyToken, postController.addCommentPost);

//UPDATE COMMENT
/**
 * @swagger
 * /api/post/edit-comment/{id}:
 *   patch:
 *     summary: Modifier un commentaire dans un post
 *     description: Permet de modifier un commentaire spécifique dans un post existant.
 *     tags:
 *       - Commentaires
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID du post auquel appartient le commentaire
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               post:
 *                   $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: Commentaire modifié avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: L'ID du post mis à jour
 *                 comments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: L'ID du commentaire
 *                       commenterId:
 *                         type: string
 *                         description: L'ID de l'utilisateur qui a commenté
 *                       text:
 *                         type: string
 *                         description: Le texte du commentaire
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *                         description: La date et l'heure du commentaire
 *       400:
 *         description: IDs invalides
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "ID(s) invalide(s)"
 *       404:
 *         description: Le post ou le commentaire n'a pas été trouvé
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Post ou commentaire non trouvé"
 *       500:
 *         description: Erreur interne du serveur lors de la modification du commentaire
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Une erreur est survenue lors de la modification du commentaire."
 */
router.patch("/edit-comment/:id", verifyToken, postController.updateComment);

//DELETE COMMENT
/**
 * @swagger
 * /api/post/comment/delete/{id}:
 *   patch:
 *     summary: Supprimer un commentaire d'un post
 *     description: Permet de supprimer un commentaire spécifique dans un post existant.
 *     tags:
 *       - Commentaires
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID du post auquel appartient le commentaire
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               commentId:
 *                 type: string
 *                 description: L'ID du commentaire à supprimer
 *                 example: 614d6f1c3a6b3f456abc1234
 *     responses:
 *       200:
 *         description: Commentaire supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Commentaire supprimé avec succès."
 *       400:
 *         description: IDs invalides
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "ID(s) invalide(s)"
 *       404:
 *         description: Le post ou le commentaire n'a pas été trouvé
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Post ou commentaire non trouvé"
 *       500:
 *         description: Erreur interne du serveur lors de la suppression du commentaire
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Une erreur est survenue lors de la suppression du commentaire."
 */
router.put("/comment/delete/:id", verifyToken, postController.deleteComment);

//LIKER UN COMMENT
/**
 * @swagger
 * /api/post/comment/like/{id}:
 *   patch:
 *     summary: Liker un commentaire d'un post
 *     description: Permet d'ajouter un like à un commentaire spécifique dans un post existant.
 *     tags:
 *       - Commentaires
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID du post contenant le commentaire à liker
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                post:
 *                   $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: Commentaire liké avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Commentaire liké avec succès
 *                 post:
 *                   $ref: '#/components/schemas/Post'
 *
 *       400:
 *         description: IDs invalides ou commentaire déjà liké
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Comment ID inconnu"
 *       404:
 *         description: Post ou commentaire non trouvé
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Post ou commentaire non trouvé"
 *       500:
 *         description: Erreur interne du serveur lors du like
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Une erreur est survenue lors du like du commentaire."
 */
router.put("/comment/like/:id", verifyToken, postController.addLikeComment);

/**
 * @swagger
 * /api/post/comment/unlike/{id}:
 *   put:
 *     summary: Retirer un like d'un commentaire
 *     description: Permet à un utilisateur de retirer son like d’un commentaire spécifique dans un post.
 *     tags:
 *       - Commentaires
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID du post contenant le commentaire
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               commentId:
 *                 type: string
 *                 example: 65f0cadc58f8e5c3c3cde456
 *               userId:
 *                 type: string
 *                 example: 65e8fabc12345678d1f0a222
 *     responses:
 *       200:
 *         description: Like retiré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Like retiré avec succès du commentaire
 *                 post:
 *                   $ref: '#/components/schemas/Post'
 *       400:
 *         description: IDs invalides
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "User ID inconnu"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Une erreur est survenue lors du unlike du commentaire."
 */
router.put("/comment/unlike/:id", verifyToken, postController.unLikeComment);

/**
 * @swagger
 * /api/post/save/{id}:
 *   put:
 *     summary: Enregistrer un post (favori)
 *     description: Permet à un utilisateur d'enregistrer un post dans ses favoris.
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: L'ID du post à enregistrer
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 65e8fabc12345678d1f0a999
 *     responses:
 *       200:
 *         description: Post enregistré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Post ID ou User ID invalide
 *       404:
 *         description: Post non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put("/save/:id", verifyToken, postController.savePost);

/**
 * @swagger
 * /api/post/unsave/{id}:
 *   put:
 *     summary: Retirer un post des favoris
 *     description: Permet à un utilisateur de retirer un post de ses favoris.
 *     tags:
 *       - Posts
 *     security:
 *     - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: L'ID du post à retirer des favoris
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 65e8fabc12345678d1f0a999
 *     responses:
 *       200:
 *         description: Post retiré des favoris avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Post ID ou User ID invalide
 *       404:
 *         description: Post non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put("/unsave/:id", verifyToken, postController.unsavePost);

router.get("/likers/:id", verifyToken, postController.getLikers);
module.exports = router;
