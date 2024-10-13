const swaggerJSDoc = require("swagger-jsdoc");

// Configuration de Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "Documentation de l'API du projet randonné",
      contact: {
        name: "Beguerisse",
      },
      servers: ["http://localhost:8000"],
    },
  },
  // Chemins vers les fichiers contenant des annotations Swagger pour les routes
  apis: ["./routes/*.js"], // Assure-toi que le chemin correspond à tes fichiers de route
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

module.exports = swaggerDocs;
