const Sequelize = require("sequelize");
require("dotenv").config();

// Create a new Sequelize instance
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
});

module.exports = sequelize;
