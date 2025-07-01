const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const UserModel = require("../models/user.model");
const PostModel = require("../models/post.model");
require("dotenv").config();
console.log("MONGO_URL utilisé:", process.env.MONGO_URL);

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGO_URL, {
    dbName: "social-network",
  })
  .then(() =>
    console.log("Connexion à MongoDB réussie !", process.env.MONGO_URL)
  )
  .catch((error) =>
    console.error("Erreur de connexion à MongoDB :", error.message)
  );

// Données d'exemple pour les utilisateurs (20 utilisateurs réalistes)
const usersData = [
  {
    name: "Amélie Dubois",
    userName: "amelie_dubois",
    email: "amelie.dubois@gmail.com",
    password: "password123",
    bio: "Photographe freelance 📸 | Amoureuse de la nature 🌿",
    picture:
      "https://images.unsplash.com/photo-1494790108755-2616b612b789?w=150",
  },
  {
    name: "Thomas Martin",
    userName: "thomas_martin",
    email: "thomas.martin@outlook.fr",
    password: "password123",
    bio: "Dev Full-Stack 💻 | Passionné de tech et café ☕",
    picture:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
  },
  {
    name: "Sophie Legrand",
    userName: "sophie_legrand",
    email: "sophie.legrand@yahoo.fr",
    password: "password123",
    bio: "Artiste peintre 🎨 | Créatrice de bijoux ✨",
    picture:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
  },
  {
    name: "Julien Moreau",
    userName: "julien_moreau",
    email: "julien.moreau@gmail.com",
    password: "password123",
    bio: "Chef cuisinier 👨‍🍳 | Cuisine du monde 🌍",
    picture:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
  },
  {
    name: "Camille Rousseau",
    userName: "camille_rousseau",
    email: "camille.rousseau@free.fr",
    password: "password123",
    bio: "Coach sportive 💪 | Nutrition & bien-être 🥗",
    picture: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
  },
  {
    name: "Lucas Bernard",
    userName: "lucas_bernard",
    email: "lucas.bernard@gmail.com",
    password: "password123",
    bio: "Musicien 🎸 | Compositeur indé 🎵",
    picture:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
  },
  {
    name: "Marine Petit",
    userName: "marine_petit",
    email: "marine.petit@hotmail.fr",
    password: "password123",
    bio: "Blogueuse voyage ✈️ | Digital nomad 🌎",
    picture:
      "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=150",
  },
  {
    name: "Antoine Garnier",
    userName: "antoine_garnier",
    email: "antoine.garnier@gmail.com",
    password: "password123",
    bio: "Architecte 🏗️ | Design urbain & éco-construction",
    picture:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150",
  },
  {
    name: "Léa Vincent",
    userName: "lea_vincent",
    email: "lea.vincent@outlook.fr",
    password: "password123",
    bio: "Vétérinaire 🐾 | Protection animale 💚",
    picture:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
  },
  {
    name: "Maxime Roux",
    userName: "maxime_roux",
    email: "maxime.roux@gmail.com",
    password: "password123",
    bio: "Gamer 🎮 | Streamer & développeur d'apps",
    picture:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150",
  },
  {
    name: "Clara Simon",
    userName: "clara_simon",
    email: "clara.simon@free.fr",
    password: "password123",
    bio: "Danseuse classique 💃 | Professeure de ballet",
    picture:
      "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150",
  },
  {
    name: "Hugo Laurent",
    userName: "hugo_laurent",
    email: "hugo.laurent@gmail.com",
    password: "password123",
    bio: "Entrepreneur 🚀 | Startup tech & IA",
    picture:
      "https://images.unsplash.com/photo-1463453091185-61582044d556?w=150",
  },
  {
    name: "Manon Durand",
    userName: "manon_durand",
    email: "manon.durand@yahoo.fr",
    password: "password123",
    bio: "Étudiante en médecine 👩‍⚕️ | Passionnée de science",
    picture:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150",
  },
  {
    name: "Raphaël Blanc",
    userName: "raphael_blanc",
    email: "raphael.blanc@gmail.com",
    password: "password123",
    bio: "Journaliste 📰 | Reporter freelance 🌍",
    picture:
      "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150",
  },
  {
    name: "Chloé Mercier",
    userName: "chloe_mercier",
    email: "chloe.mercier@outlook.fr",
    password: "password123",
    bio: "Designer UX/UI 🎨 | Créative digitale ✨",
    picture:
      "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=150",
  },
  {
    name: "Valentin Fabre",
    userName: "valentin_fabre",
    email: "valentin.fabre@gmail.com",
    password: "password123",
    bio: "Barista ☕ | Torréfacteur artisanal & latte art",
    picture:
      "https://images.unsplash.com/photo-1520409364224-63400afe26e5?w=150",
  },
  {
    name: "Jade Lefevre",
    userName: "jade_lefevre",
    email: "jade.lefevre@free.fr",
    password: "password123",
    bio: "Yoga teacher 🧘‍♀️ | Mindfulness & méditation",
    picture:
      "https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=150",
  },
  {
    name: "Théo Girard",
    userName: "theo_girard",
    email: "theo.girard@gmail.com",
    password: "password123",
    bio: "Mécanicien moto 🏍️ | Passionné de vitesse",
    picture:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150",
  },
  {
    name: "Océane Robert",
    userName: "oceane_robert",
    email: "oceane.robert@hotmail.fr",
    password: "password123",
    bio: "Biologiste marine 🌊 | Protection des océans 🐋",
    picture:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150",
  },
  {
    name: "Adrien Morel",
    userName: "adrien_morel",
    email: "adrien.morel@gmail.com",
    password: "password123",
    bio: "Personal trainer 💪 | Crossfit & nutrition sportive",
    picture:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150",
  },
];

// Posts spécifiques par type d'utilisateur pour éviter les doublons
const postsByUserType = {
  // Amélie Dubois - Photographe
  photographe: [
    {
      message:
        "Golden hour au lac d'Annecy 🌅 Rien de tel qu'un lever de soleil pour commencer la journée ! #photography #nature #goldenhour",
      picture:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    },
    {
      message:
        "Macro sur une goutte de rosée 💧 Les détails qui nous échappent... #macro #photography #morning",
      picture:
        "https://images.unsplash.com/photo-1516298773066-c48f8e9bd92b?w=500",
    },
    {
      message:
        "Portrait session en lumière naturelle 📸 La beauté de l'authenticité #portrait #photography #natural",
      picture:
        "https://images.unsplash.com/photo-1494790108755-2616b612b789?w=500",
    },
    {
      message:
        "Architecture urbaine et géométrie 🏗️ Les lignes racontent une histoire #architecture #urban #geometry",
      picture:
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500",
    },
  ],

  // Thomas Martin - Développeur
  developer: [
    {
      message:
        "Nouveau projet React en cours 💻 Cette fois avec TypeScript ! #react #typescript #webdev #coding",
      picture:
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500",
    },
    {
      message:
        "Debug session de 4h... mais ça marche ! 🐛➡️✅ #debugging #programming #victory",
      picture:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500",
    },
    {
      message:
        "Code review avec l'équipe ☕ Toujours enrichissant ! #teamwork #code #collaboration",
      picture:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500",
    },
    {
      message:
        "Déploiement en production réussi ! 🚀 Next.js + Vercel = combo parfait #deployment #nextjs #vercel",
      picture:
        "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?w=500",
    },
  ],

  // Sophie Legrand - Artiste
  artiste: [
    {
      message:
        "Nouvelle toile terminée ! 🎨 Inspiration abstraite du moment #art #painting #abstract #creative",
      picture:
        "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=500",
    },
    {
      message:
        "Atelier bijoux aujourd'hui ✨ Création d'une bague en argent #jewelry #handmade #silver",
      picture:
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500",
    },
    {
      message:
        "Exposition au Louvre... l'art classique me fascine toujours 🏛️ #museum #art #inspiration",
      picture:
        "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500",
    },
    {
      message:
        "Sculpture en céramique en cours 🏺 L'argile entre mes mains prend vie #ceramic #sculpture #clay",
      picture:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500",
    },
  ],

  // Julien Moreau - Chef
  chef: [
    {
      message:
        "Risotto aux cèpes fait maison 🍄 Recette de grand-mère ! #cooking #risotto #homemade #mushrooms",
      picture:
        "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=500",
    },
    {
      message:
        "Fusion asiatique ce soir 🥢 Pad Thaï revisité ! #asian #fusion #cooking #thailand",
      picture:
        "https://images.unsplash.com/photo-1559715541-5daf8a0296fe?w=500",
    },
    {
      message:
        "Bread making session 🍞 Rien ne vaut le pain fait maison #bread #baking #homemade",
      picture:
        "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=500",
    },
    {
      message:
        "Nouvelle carte d'automne 🍂 Produits de saison à l'honneur ! #seasonal #autumn #menu #local",
      picture:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500",
    },
  ],

  // Camille Rousseau - Coach sportive
  coach: [
    {
      message:
        "Séance HIIT de ce matin 💪 30 minutes d'intensité ! #hiit #fitness #morning #workout",
      picture:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500",
    },
    {
      message:
        "Plan nutritionnel personnalisé 🥗 L'alimentation, 70% du succès ! #nutrition #fitness #health #coaching",
      picture:
        "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500",
    },
    {
      message:
        "Cours de groupe ce soir ! 💪 Energy au maximum #group #fitness #energy #motivation",
      picture:
        "https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=500",
    },
    {
      message:
        "Préparation physique pour marathon 🏃‍♀️ Objectif : sous les 3h30 ! #marathon #running #training",
      picture:
        "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=500",
    },
  ],

  // Lucas Bernard - Musicien
  musicien: [
    {
      message:
        "Session studio ce soir 🎸 Nouveau morceau en préparation ! #music #guitar #studio #indie",
      picture:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500",
    },
    {
      message:
        "Concert acoustique demain soir 🎵 Hâte de partager mes nouvelles compos ! #concert #acoustic #live",
      picture:
        "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500",
    },
    {
      message:
        "Nouvelle guitare ! 😍 Une Martin D-28, le son est magique ✨ #guitar #martin #music",
      picture:
        "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500",
    },
    {
      message:
        "Composition nocturne 🌙 L'inspiration vient souvent la nuit #composition #night #inspiration #songwriter",
      picture:
        "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=500",
    },
  ],

  // Marine Petit - Blogueuse voyage
  blogueuse: [
    {
      message:
        "Road trip dans les Alpes 🏔️ Prochain stop : Chamonix ! #roadtrip #alps #mountains #travel",
      picture:
        "https://images.unsplash.com/photo-1464822759771-1337a9db61e1?w=500",
    },
    {
      message:
        "Bali me manque déjà... 🌴 Vivement le prochain voyage ! #bali #indonesia #travel #paradise",
      picture:
        "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=500",
    },
    {
      message:
        "Digital nomad life à Lisbonne 💻🌊 Coder face à l'océan ! #digitalnomad #lisbon #portugal #remote",
      picture:
        "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=500",
    },
    {
      message:
        "Local market in Morocco 🇲🇦 Les couleurs et les saveurs ! #morocco #market #travel #culture",
      picture:
        "https://images.unsplash.com/photo-1539650116574-75c0c6d73d4e?w=500",
    },
  ],
};

// Posts génériques pour les autres utilisateurs
const genericPosts = [
  {
    message:
      "Belle journée ensoleillée ☀️ Parfait pour une balade ! #sunshine #walk #goodday",
    picture:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
  },
  {
    message:
      "Café du matin ☕ La journée peut commencer ! #coffee #morning #energy",
    picture:
      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=500",
  },
  {
    message:
      "Nouveau livre passionnant 📚 Impossible de le lâcher ! #reading #book #literature",
    picture:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500",
  },
  {
    message: "Weekend détente en vue 😌 Time to relax ! #weekend #relax #chill",
    picture:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
  },
  {
    message:
      "Soirée entre amis 🍻 Les bons moments ! #friends #evening #goodtimes",
    picture: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=500",
  },
  {
    message:
      "Nature therapy 🌿 Rien de mieux pour se ressourcer #nature #therapy #peaceful",
    picture:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500",
  },
  {
    message:
      "Nouvelle coupe de cheveux ✂️ Changement radical ! #haircut #new #style",
    picture:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=500",
  },
  {
    message:
      "Shopping therapy 🛍️ Petits plaisirs du weekend #shopping #therapy #weekend",
    picture:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500",
  },
];

// Mapping des utilisateurs vers leurs types de contenu
const userContentTypes = [
  "photographe", // Amélie Dubois
  "developer", // Thomas Martin
  "artiste", // Sophie Legrand
  "chef", // Julien Moreau
  "coach", // Camille Rousseau
  "musicien", // Lucas Bernard
  "blogueuse", // Marine Petit
  "generic", // Antoine Garnier - Architecte
  "generic", // Léa Vincent - Vétérinaire
  "generic", // Maxime Roux - Gamer
  "generic", // Clara Simon - Danseuse
  "generic", // Hugo Laurent - Entrepreneur
  "generic", // Manon Durand - Étudiante médecine
  "generic", // Raphaël Blanc - Journaliste
  "generic", // Chloé Mercier - Designer
  "generic", // Valentin Fabre - Barista
  "generic", // Jade Lefevre - Yoga teacher
  "generic", // Théo Girard - Mécanicien
  "generic", // Océane Robert - Biologiste marine
  "generic", // Adrien Morel - Personal trainer
];

// Commentaires réalistes et variés par catégorie
const commentsByCategory = {
  photographe: [
    "Quelle lumière ! 😍 Tu as pris ça avec quel objectif ?",
    "Cette composition est parfaite 📸",
    "Les couleurs sont juste dingues !",
    "Tu m'apprends la photo ? 😅",
    "Canon ou Nikon ? 🤔",
    "Instagram digne ! 🔥",
    "Cette depth of field... 👌",
    "Lightroom ou Photoshop pour le post-traitement ?",
  ],

  developer: [
    "Clean code ! 💻 Tu utilises quelle stack ?",
    "TypeScript > JavaScript 🔥",
    "Tu bosses sur VSCode ?",
    "Cette logique est élégante 👨‍💻",
    "GitHub dispo ? 😏",
    "React c'est la vie !",
    "J'ai eu le même bug hier 😅",
    "Architecture nickel ! 🏗️",
  ],

  artiste: [
    "Tes couleurs me parlent ! 🎨",
    "Technique impressionnante",
    "Cette texture... comment tu fais ça ?",
    "Peinture à l'huile ou acrylique ?",
    "Ça mériterait d'être dans une galerie",
    "L'art abstrait te va si bien !",
    "Inspiration ? 🤔",
    "Combien d'heures de travail ?",
  ],

  chef: [
    "La recette stp ! 🤤",
    "Ça a l'air délicieux !",
    "Tu me cuisines quoi pour ce soir ? 😂",
    "Restaurant niveau chef ! 👨‍🍳",
    "Mes papilles vibrent !",
    "Secret d'assaisonnement ?",
    "Tu livres ? 😅",
    "Gordon Ramsay qui ? 🔥",
  ],

  coach: [
    "Motivation au top ! 💪",
    "Combien de séries ?",
    "Tu me coaches quand ? 😅",
    "Ces résultats ! 🔥",
    "Nutrition stricte ?",
    "Quel programme tu suis ?",
    "Beast mode ON ! 💯",
    "No pain no gain ! 🏋️‍♀️",
  ],

  musicien: [
    "Spotify quand ? 🎵",
    "Cette mélodie ! 😍",
    "Accord parfait !",
    "Concert bientôt ? 🎤",
    "Tu composes depuis longtemps ?",
    "Gibson ou Fender ? 🎸",
    "Son de malade !",
    "Prochaine tournée ? 😏",
  ],

  blogueuse: [
    "Destination de rêve ! ✈️",
    "Ça coûte combien ce voyage ?",
    "Weather parfait ! ☀️",
    "Hôtel ou Airbnb ?",
    "J'ajoute à ma bucket list !",
    "Voyage solo ? 🎒",
    "Ces paysages ! 🌍",
    "Budget backpacker ? 😅",
  ],

  generic: [
    "Trop stylé ! 😎",
    "Excellent ! 👌",
    "J'adore ! ❤️",
    "Tu gères ! 💪",
    "Nickel ! 👍",
    "Ça me donne envie !",
    "Super moment ! 😊",
    "Bonne ambiance ! ✨",
    "Content pour toi ! 🙂",
    "Profite bien ! 😉",
    "Classe ! 🔥",
    "Sympa ça ! 👏",
    "Quel plaisir ! 😍",
    "Perfect ! ✅",
    "Tu m'étonnes ! 😲",
    "Jolie photo ! 📸",
    "Good vibes ! ✌️",
    "Jaloux ! 😅",
    "Inspiring ! 🌟",
    "Continue ! 💯",
    "Woah ! 🤯",
    "Love it ! 💕",
    "Epic ! 🚀",
    "Amazing ! ⭐",
    "GG ! 🎉",
  ],
};

async function seedData() {
  try {
    // Vider les collections existantes
    console.log("Suppression des données existantes...");
    await UserModel.deleteMany({});
    await PostModel.deleteMany({});

    // Créer les utilisateurs
    console.log("Création des utilisateurs...");
    const users = [];

    for (const userData of usersData) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = new UserModel({
        ...userData,
        password: hashedPassword,
      });
      await user.save();
      users.push(user);
      console.log(`Utilisateur créé: ${user.userName}`);
    }

    // Créer des relations de followers réalistes
    console.log("Création des relations de followers...");

    // Chaque utilisateur suit entre 3 et 8 autres utilisateurs
    for (let i = 0; i < users.length; i++) {
      const currentUser = users[i];
      const numFollowing = Math.floor(Math.random() * 6) + 3; // 3 à 8 follows
      const followingIds = [];

      // Sélectionner aléatoirement des utilisateurs à suivre
      while (followingIds.length < numFollowing) {
        const randomIndex = Math.floor(Math.random() * users.length);
        const targetUser = users[randomIndex];

        // Ne pas se suivre soi-même et éviter les doublons
        if (
          randomIndex !== i &&
          !followingIds.includes(targetUser._id.toString())
        ) {
          followingIds.push(targetUser._id);

          // Ajouter à la liste following du user actuel
          currentUser.following.push(targetUser._id);

          // Ajouter à la liste followers du user ciblé
          targetUser.followers.push(currentUser._id);
        }
      }

      console.log(`${currentUser.userName} suit ${numFollowing} utilisateurs`);
    }

    // Sauvegarder tous les utilisateurs avec leurs nouvelles relations
    for (const user of users) {
      await user.save();
    }

    // Créer les posts - Chaque utilisateur aura 3-4 posts
    console.log("Création des posts...");
    const posts = [];
    let postCounter = 0;

    for (let userIndex = 0; userIndex < users.length; userIndex++) {
      const user = users[userIndex];
      const numPosts = Math.floor(Math.random() * 2) + 3; // 3 ou 4 posts par utilisateur

      // Garder trace des posts déjà utilisés par cet utilisateur
      const usedPostIndices = [];

      for (let postIndex = 0; postIndex < numPosts; postIndex++) {
        // Sélectionner le bon pool de posts selon le type d'utilisateur
        const userType = userContentTypes[userIndex];
        let availablePosts;

        if (userType === "generic") {
          availablePosts = genericPosts;
        } else {
          availablePosts = postsByUserType[userType];
        }

        // Éviter les doublons pour le même utilisateur
        let randomPostIndex;
        let attempts = 0;
        do {
          randomPostIndex = Math.floor(Math.random() * availablePosts.length);
          attempts++;
        } while (usedPostIndices.includes(randomPostIndex) && attempts < 10);

        // Ajouter l'index à la liste des posts utilisés
        usedPostIndices.push(randomPostIndex);

        const postData = availablePosts[randomPostIndex];

        // Créer le post avec une date dans le passé (entre 1 et 14 jours)
        const postDate = new Date(
          Date.now() - (Math.random() * 13 + 1) * 24 * 60 * 60 * 1000
        );

        const post = new PostModel({
          posterId: user._id,
          message: postData.message,
          picture: postData.picture,
          public_id: `seed_post_${++postCounter}`,
          createdAt: postDate,
          updatedAt: postDate,
        });

        // Ajouter des likes aléatoires (plus de variété)
        const numLikes = Math.floor(Math.random() * 8) + 1; // 1 à 8 likes
        const likers = [];
        for (let j = 0; j < numLikes; j++) {
          const randomUserIndex = Math.floor(Math.random() * users.length);
          const likerId = users[randomUserIndex]._id.toString();
          if (!likers.includes(likerId) && likerId !== user._id.toString()) {
            likers.push(likerId);
          }
        }
        post.likers = likers;

        // Ajouter des commentaires contextuels selon la profession
        const numComments = Math.floor(Math.random() * 5) + 1; // 1 à 5 commentaires
        const comments = [];

        // Déterminer la catégorie de commentaires selon la profession de l'auteur du post
        let commentCategory = "generic";
        if (user.bio) {
          if (user.bio.includes("photographe")) commentCategory = "photographe";
          else if (user.bio.includes("développeur"))
            commentCategory = "developer";
          else if (user.bio.includes("artiste")) commentCategory = "artiste";
          else if (user.bio.includes("chef")) commentCategory = "chef";
          else if (user.bio.includes("coach")) commentCategory = "coach";
          else if (user.bio.includes("musicien")) commentCategory = "musicien";
          else if (user.bio.includes("blogueuse"))
            commentCategory = "blogueuse";
        }

        // Pool de commentaires : spécialisés + génériques pour plus de variété
        const specializedComments = commentsByCategory[commentCategory] || [];
        const allAvailableComments = [
          ...specializedComments,
          ...commentsByCategory.generic,
        ];

        for (let k = 0; k < numComments; k++) {
          const randomUserIndex = Math.floor(Math.random() * users.length);
          const commenter = users[randomUserIndex];

          // Choisir un commentaire aléatoire dans le pool disponible
          const randomCommentIndex = Math.floor(
            Math.random() * allAvailableComments.length
          );
          const commentText = allAvailableComments[randomCommentIndex];

          // Likes sur le commentaire
          const commentLikers = [];
          const numCommentLikes = Math.floor(Math.random() * 4); // 0 à 3 likes
          for (let l = 0; l < numCommentLikes; l++) {
            const randomLikerIndex = Math.floor(Math.random() * users.length);
            const likerId = users[randomLikerIndex]._id.toString();
            if (!commentLikers.includes(likerId)) {
              commentLikers.push(likerId);
            }
          }

          // Commentaire créé APRÈS le post (entre la création du post et maintenant)
          const timeSincePost = Date.now() - postDate.getTime();
          const commentDate = new Date(
            postDate.getTime() + Math.random() * timeSincePost
          );

          comments.push({
            commenterId: commenter._id,
            text: commentText,
            likers: commentLikers,
            timestamp: commentDate,
          });
        }

        post.comments = comments;
        await post.save();
        posts.push(post);
        console.log(
          `Post ${postIndex + 1}/${numPosts} créé pour ${
            user.userName
          }: ${post.message.substring(0, 50)}...`
        );
      }
    }

    console.log("\n✅ Seed terminé avec succès !");
    console.log(`📊 Statistiques:`);
    console.log(`   - Utilisateurs créés: ${users.length}`);
    console.log(`   - Posts créés: ${posts.length}`);
    console.log(`   - Relations de followers configurées`);
    console.log(`   - Commentaires et likes ajoutés`);
    console.log(
      `   - Moyenne: ${Math.floor(
        posts.length / users.length
      )} posts par utilisateur`
    );
  } catch (error) {
    console.error("❌ Erreur lors du seed:", error);
  } finally {
    mongoose.disconnect();
    console.log("Déconnexion de MongoDB");
  }
}

// Exécuter le seed
seedData();
