const express = require('express');
const router = express.Router();
const { Note, Category } = require('../models'); // Import models

// ✅ CREATE A NEW NOTE
router.post('/', async (req, res) => {
    try {
      const { title, content, categoryId } = req.body;
        if (categoryId) {
        const category = await Category.findByPk(categoryId);
        if (!category) {
          return res.status(400).json({ error: "Invalid category ID" });
        }
      }
  
      const newNote = await Note.create({ title, content, categoryId });
      res.status(201).json(newNote);
    } catch (error) {
      console.error('❌ Error creating note:', error);
      res.status(500).json({ error: 'Error creating note' });
    }
  });   

// ✅ GET ALL ACTIVE NOTES
router.get('/', async (req, res) => {
    try {
      const { archived, categoryId } = req.query; 
      let whereCondition = {};
  
      if (archived !== undefined) {
        whereCondition.archived = archived === 'true';  
      }
  
      if (categoryId) {
        whereCondition.categoryId = categoryId;
      }
  
      const notes = await Note.findAll({
        where: whereCondition,
        include: [{ model: Category, as: 'category' }]
      });
  
      res.json(notes);
    } catch (error) {
      console.error('Error fetching notes:', error);
      res.status(500).json({ error: 'Error fetching notes' });
    }
  });  
  

// ✅ GET A NOTE BY ID
router.get('/:id', async (req, res) => {
  try {
    const note = await Note.findByPk(req.params.id, {
      include: Category, 
    });
    if (!note) return res.status(404).json({ error: 'Note not found' });

    res.json(note);
  } catch (error) {
    console.error('Error getting note:', error);
    res.status(500).json({ error: 'Error getting note' });
  }
});

// ✅ UPDATE A NOTE
router.put('/:id', async (req, res) => {
    try {
      const { title, content, archived, categoryId } = req.body;
  
      const note = await Note.findByPk(req.params.id);
      if (!note) return res.status(404).json({ error: 'Note not found' });
  
      // ✅ Update note details
      note.title = title;
      note.content = content;
      note.archived = archived;
      note.categoryId = categoryId;
      await note.save();
  
      // ✅ Retrieve the updated note with its category
      const updatedNote = await Note.findByPk(note.id, {
        include: { model: Category, attributes: ['id', 'name'] },
      });
  
      res.json(updatedNote);
    } catch (error) {
      console.error('Error updating note:', error);
      res.status(500).json({ error: 'Error updating note' });
    }
  });
  

// ✅ DELETE A NOTE
router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findByPk(req.params.id);
    if (!note) return res.status(404).json({ error: 'Note not found' });

    await note.destroy();
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ error: 'Error deleting note' });
  }
});

// ✅ ARCHIVE/UNARCHIVE A NOTE
router.patch('/:id/archive', async (req, res) => {
  try {
    const note = await Note.findByPk(req.params.id);
    if (!note) return res.status(404).json({ error: 'Note not found' });

    note.archived = !note.archived; // Toggle archive status
    await note.save();

    res.json(note);
  } catch (error) {
    console.error('Error archiving note:', error);
    res.status(500).json({ error: 'Error archiving note' });
  }
});

// ✅ ASSIGN A CATEGORY TO A NOTE
router.post('/:noteId/categories/:categoryId', async (req, res) => {
  try {
    const { noteId, categoryId } = req.params;

    const note = await Note.findByPk(noteId);
    const category = await Category.findByPk(categoryId);

    if (!note || !category) {
      return res.status(404).json({ error: 'Note or Category not found' });
    }

    // Check if Note belongs to Category (One-to-Many relation)
    note.categoryId = category.id;
    await note.save();

    res.status(200).json({ message: 'Category assigned to note successfully' });

  } catch (error) {
    console.error("Error assigning category:", error);
    res.status(500).json({ error: "Error assigning category" });
  }
});

// ✅ GET CATEGORIES OF A SPECIFIC NOTE
router.get('/:noteId/categories', async (req, res) => {
  try {
    const note = await Note.findByPk(req.params.noteId, {
      include: Category
    });

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json(note.Category);
  } catch (error) {
    console.error("Error getting categories:", error);
    res.status(500).json({ error: "Error getting categories" });
  }
});

module.exports = router;
