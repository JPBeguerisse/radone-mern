require("dotenv").config({ path: "./config/.env" });
require("./config/db");
const express = require("express");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./swagger"); // Importer la configuration Swagger

const userRoutes = require("./routes/user.routes");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Configuration de Swagger pour servir la documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Exemple de route
app.get("/api", (req, res) => {
  res.send("Bienvenue sur l'API");
});

app.use("/api/user", userRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Listenning on port ${process.env.PORT}`);
});
