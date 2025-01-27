require('dotenv').config(); 
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASS:", process.env.DB_PASS);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_PASS (typeof):", typeof process.env.DB_PASS, process.env.DB_PASS);

const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");

const app = express();

const notesRoutes = require('./routes/notes');
const categoryRoutes = require('./routes/category');

app.use('/api/notes', notesRoutes);
app.use('/api/categories', categoryRoutes);

app.get("/", (req, res) => {
    res.send("API Running!");
});

const PORT = process.env.PORT || 5001;

sequelize.sync()
  .then(() => {
    console.log("Database connected!");
    app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error("DB Connection Error:", err));