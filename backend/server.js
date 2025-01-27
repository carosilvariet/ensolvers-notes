require('dotenv').config({ path: __dirname + '/../.env' });
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASS:", process.env.DB_PASS);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_PASS (typeof):", typeof process.env.DB_PASS, process.env.DB_PASS);

const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");

// Create an Express instance
const app = express();

// Middleware setup (CORS y JSON antes de las rutas)
app.use(cors()); // Enable CORS
app.use(express.json()); // Enable JSON parsing

// Import routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
console.log("JWT_SECRET:", process.env.JWT_SECRET);

const notesRoutes = require('./routes/notes');
const categoryRoutes = require('./routes/category');

// Set up routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/categories', categoryRoutes);

// Base path to check if the server is running
app.get("/", (req, res) => {
    res.send("API Running!");
});

// Connect to the database and start the server
const PORT = process.env.PORT || 5001;

sequelize.sync()
  .then(() => {
    console.log("Database connected!");
    app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error("DB Connection Error:", err));
