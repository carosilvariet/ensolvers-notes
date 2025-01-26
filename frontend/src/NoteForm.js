import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NoteForm = ({ onAddNote, editingNote, onUpdateNote }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5001/api/categories')
      .then(response => setCategories(response.data))
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title);
      setContent(editingNote.content);
      setSelectedCategory(editingNote.categoryId || '');
    } else {
      setTitle('');
      setContent('');
      setSelectedCategory('');
    }
  }, [editingNote]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!title.trim() || !content.trim() || !selectedCategory) {
      alert('⚠️ Please fill in all fields before adding a note.');
      return;
    }
  
    const newNote = { 
      title: title.trim(), 
      content: content.trim(), 
      categoryId: selectedCategory ? Number(selectedCategory) : null // ✅ Convertir a número o null
    };
  
    console.log('📤 Sending note:', newNote);
  
    try {
      const response = await axios.post('http://localhost:5001/api/notes', newNote);
      console.log('✅ Note created successfully:', response.data);
      onAddNote(response.data);
      setTitle('');
      setContent('');
      setSelectedCategory('');
    } catch (error) {
      console.error('❌ Error sending note:', error.response?.data || error.message);
      alert('Error creating note. Please check the console.');
    }
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
      />
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="">Select Category</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <button type="submit">{editingNote ? 'Update Note' : 'Add New Note'}</button>
    </form>
  );
};

export default NoteForm;
