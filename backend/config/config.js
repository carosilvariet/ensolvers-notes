require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || "postgres",
    password: `${process.env.DB_PASS}` || "Michigan2388",
    database: process.env.DB_NAME || "ensolvers_notes",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    dialect: "postgres"
  }
};

