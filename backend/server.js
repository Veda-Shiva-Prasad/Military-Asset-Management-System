require("dotenv").config();

const app = require("./app");
const sequelize = require("./config/database");
require("./models");

const seedDatabase = require("./seed/seedDatabase");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL connected successfully");

    await sequelize.sync();
    console.log("Database tables synchronized");

    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to start server:", error.message);
  }
};

startServer();
