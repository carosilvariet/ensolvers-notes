const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

const router = express.Router();

// Sign up
// Sign up
router.post('/register', async (req, res) => {
    try {
      const { username, email, password } = req.body;
      console.log("Register Request Body:", req.body); // <-- LOG para ver lo que llega
  
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        console.log("El email ya está registrado:", email); // <-- LOG
        return res.status(400).json({ message: 'El email ya está registrado' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
      });
  
      console.log("Usuario creado:", user.toJSON()); // <-- LOG
  
      return res.status(201).json({ message: 'Usuario registrado con éxito', user });
    } catch (error) {
      console.error("Error en Register:", error);
      return res.status(500).json({ message: 'Error en el servidor' });
    }
  });
  
  // Login
  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log("Login Request Body:", req.body); // <-- LOG
  
      const user = await User.findOne({ where: { email } });
      if (!user) {
        console.log("Usuario no encontrado:", email); // <-- LOG
        return res.status(400).json({ message: 'Usuario no encontrado' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log("Contraseña incorrecta para:", email); // <-- LOG
        return res.status(400).json({ message: 'Contraseña incorrecta' });
      }
  
      const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      console.log("Token generado:", token); // <-- LOG
  
      return res.status(200).json({ message: 'Login exitoso', token });
    } catch (error) {
      console.error("Error en Login:", error);
      return res.status(500).json({ message: 'Error en el servidor' });
    }
  });  
  
module.exports = router;
