const { Sequelize } = require("sequelize");

require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: process.env.DB_PORT,
    logging: false, 

    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, 
      },
    },
  }
);

sequelize.authenticate()
  .then(() => console.log("✅ Conexión exitosa a la base de datos"))
  .catch(err => console.error("❌ Error al conectar con la DB:", err));

module.exports = sequelize;