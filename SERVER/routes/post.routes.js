const router = require("express").Router();
const postController = require("../controllers/post.controller");

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
 *                 _id:
 *                   type: string
 *                   description: L'ID du post créé
 *                 posterId:
 *                   type: string
 *                   description: L'ID de l'utilisateur qui a créé le post
 *                 message:
 *                   type: string
 *                   description: Le message du post
 *                 picture:
 *                   type: string
 *                   description: Le chemin de l'image uploadée (s'il y en a une)
 *                 video:
 *                   type: string
 *                   description: L'URL de la vidéo du post (facultatif)
 *                 likers:
 *                   type: array
 *                   description: Liste des utilisateurs ayant liké le post
 *                   items:
 *                     type: string
 *                 comments:
 *                   type: array
 *                   description: Liste des commentaires sur le post
 *                   items:
 *                     type: object
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
router.post("/", postController.createPost);

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
 *                   _id:
 *                     type: string
 *                     description: L'ID unique du post
 *                   posterId:
 *                     type: string
 *                     description: L'ID de l'utilisateur qui a posté
 *                   message:
 *                     type: string
 *                     description: Le message du post
 *                   picture:
 *                     type: string
 *                     description: L'URL de l'image associée au post (facultatif)
 *                   likers:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: Tableau des utilisateurs qui ont liké le post
 *                   comments:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         commenterId:
 *                           type: string
 *                           description: L'ID de l'utilisateur qui a commenté
 *                         text:
 *                           type: string
 *                           description: Le texte du commentaire
 *                         timestamp:
 *                           type: string
 *                           format: date-time
 *                           description: La date et l'heure du commentaire
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: Date de création du post
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: Date de la dernière mise à jour du post
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
router.get("/", postController.getPosts);

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
 *                 _id:
 *                   type: string
 *                   description: L'ID du post
 *                 posterId:
 *                   type: string
 *                   description: L'ID de l'utilisateur qui a créé le post
 *                 message:
 *                   type: string
 *                   description: Le message du post
 *                 picture:
 *                   type: string
 *                   description: L'URL de l'image associée au post (facultatif)
 *                 likers:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Liste des utilisateurs qui ont liké le post
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
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Date de création du post
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: Date de la dernière mise à jour du post
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
router.get("/:id", postController.getPost);

//MODIFIER UN POST
/**
 * @swagger
 * /api/post/{id}:
 *   put:
 *     summary: Mettre à jour un post spécifique par ID
 *     description: Cette route permet de mettre à jour un post en particulier à partir de son ID. Les champs modifiables incluent le message et l'URL de l'image.
 *     tags:
 *       - Posts
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
 *                 _id:
 *                   type: string
 *                   description: L'ID du post mis à jour
 *                 message:
 *                   type: string
 *                   description: Le message mis à jour du post
 *                 picture:
 *                   type: string
 *                   description: L'URL de l'image mise à jour du post (facultatif)
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Date de création du post
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: Date de la dernière mise à jour du post
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
router.put("/:id", postController.updatePost);

//SUPPRIMER UN POST
/**
 * @swagger
 * /api/post/{id}:
 *   delete:
 *     summary: Supprimer un post et son image associée
 *     description: Supprime un post à partir de son ID ainsi que l'image associée, si elle existe.
 *     tags:
 *       - Posts
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
router.delete("/:id", postController.deletePost);

//LIKER UN POST
/**
 * @swagger
 * /api/post/like/{id}:
 *   patch:
 *     summary: Liker un post
 *     description: Permet à un utilisateur de liker un post en ajoutant son ID à la liste des likers.
 *     tags:
 *       - Posts
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
 *                 _id:
 *                   type: string
 *                   description: L'ID du post liké
 *                 likers:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Liste des utilisateurs qui ont liké le post
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
router.patch("/like/:id", postController.like);

//UNLIKER UN POST
/**
 * @swagger
 * /api/post/unlike/{id}:
 *   patch:
 *     summary: Retirer un like d'un post
 *     description: Permet à un utilisateur de retirer son like d'un post en supprimant son ID de la liste des likers.
 *     tags:
 *       - Posts
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
 *               userId:
 *                 type: string
 *                 description: L'ID de l'utilisateur qui retire son like du post
 *                 example: 614d6f1c3a6b3f456abc1234
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
router.patch("/unlike/:id", postController.unlike);

//ADDCOMMENT
/**
 * @swagger
 * /api/post/add-comment/{id}:
 *   patch:
 *     summary: Ajouter un commentaire à un post
 *     description: Permet à un utilisateur d'ajouter un commentaire à un post.
 *     tags:
 *       - Commentaires
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
 *               commenterId:
 *                 type: string
 *                 description: L'ID de l'utilisateur qui commente le post
 *                 example: 614d6f1c3a6b3f456abc1234
 *               text:
 *                 type: string
 *                 description: Le texte du commentaire
 *                 example: "C'est un excellent post !"
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
router.patch("/add-comment/:id", postController.addCommentPost);

//UPDATE COMMENT
/**
 * @swagger
 * /api/post/edit-comment/{id}:
 *   patch:
 *     summary: Modifier un commentaire dans un post
 *     description: Permet de modifier un commentaire spécifique dans un post existant.
 *     tags:
 *       - Commentaires
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
 *                 description: L'ID du commentaire à modifier
 *                 example: 614d6f1c3a6b3f456abc1234
 *               text:
 *                 type: string
 *                 description: Le nouveau texte du commentaire
 *                 example: "Commentaire modifié"
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
router.patch("/edit-comment/:id", postController.updateComment);

//DELETE COMMENT
/**
 * @swagger
 * /api/post/comment/delete/{id}:
 *   patch:
 *     summary: Supprimer un commentaire d'un post
 *     description: Permet de supprimer un commentaire spécifique dans un post existant.
 *     tags:
 *       - Commentaires
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
router.patch("/comment/delete/:id", postController.deleteComment);

module.exports = router;
