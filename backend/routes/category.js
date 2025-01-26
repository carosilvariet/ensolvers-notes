const express = require('express');
const router = express.Router();
const { Category } = require('../models');

// Create a new category
router.post('/', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: "Name is required" });
        }
        const category = await Category.create({ name });
        res.status(201).json(category);
    } catch (error) {
        console.error("Error creating category:", error);
        res.status(500).json({ error: "Error creating category" });
    }
});

// Get all categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.json(categories);
    } catch (error) {
        console.error("Error getting categories:", error);
        res.status(500).json({ error: "Error getting categories" });
    }
});

module.exports = router;
