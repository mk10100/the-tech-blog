const Sequelize = require("sequelize");
require("dotenv").config();

// Create a new Sequelize instance
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Important - set this to false
    },
  },
});

module.exports = sequelize;
