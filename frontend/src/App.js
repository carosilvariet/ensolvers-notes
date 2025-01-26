import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';
import logo from './logo.svg';
import NoteForm from './NoteForm';
import { FaTrash } from 'react-icons/fa';

function App() {
  const [notes, setNotes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  // ✅ Fetch Notes with filters
  const fetchNotes = useCallback(async () => {
    try {
      let url = `http://localhost:5001/api/notes?archived=${showArchived}`;
      if (selectedCategory) {
        url += `&categoryId=${selectedCategory}`;
      }
  
      const response = await axios.get(url);
      console.log("Fetched Notes:", response.data); 
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  }, [showArchived, selectedCategory]);  

  // ✅ Fetch Categories
  useEffect(() => {
    axios.get('http://localhost:5001/api/categories')
      .then(response => setCategories(response.data))
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // ✅ Add Note (No duplicate notes)
  const addNote = (newNote) => {
    setNotes(prevNotes => [...prevNotes, newNote]); 
  };

  // ✅ Update Note
  const updateNoteInList = (updatedNote) => {
    setNotes(prevNotes =>
      prevNotes.map(note => (note.id === updatedNote.id ? updatedNote : note))
    );
    setEditingNote(null);
  };

  // ✅ Delete Note
  const deleteNote = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/notes/${id}`);
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  // ✅ Archive/Unarchive Note
  const toggleArchive = async (id) => {
    try {
      await axios.patch(`http://localhost:5001/api/notes/${id}/archive`);
      fetchNotes();
    } catch (error) {
      console.error('Error archiving note:', error);
    }
  };

  // ✅ Handle Category Change
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleArchiveFilterChange = (event) => {
    setShowArchived(event.target.value === "archived");
  };

  return (
    <div className="App">
      <img src={logo} className="App-logo" alt="logo" />
      <h1>Hello, Ensolvers!</h1>

      <NoteForm 
        onAddNote={addNote} 
        editingNote={editingNote} 
        onUpdateNote={updateNoteInList} 
      />

      <div>
        <label>Show: </label>
        <select value={showArchived ? "archived" : "active"} onChange={handleArchiveFilterChange}>
          <option value="active">Active Notes</option>
          <option value="archived">Archived Notes</option>
        </select>

        <label>Filter by Category</label>
        <select value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
      </div>

      <ul>
  {notes.length > 0 ? (
    notes.map(note => (
      <li key={note.id}>
        {note.title}
        <button onClick={() => deleteNote(note.id)}>
          <FaTrash />
        </button>
        <button onClick={() => setEditingNote(note)}>✏ Edit</button>
        <button onClick={() => toggleArchive(note.id)}>
          {note.archived ? 'Unarchive' : 'Archive'}
        </button>

        <div>
          {note.category ? ( 
            <span>{note.category.name}</span>
          ) : (
            <span>No categories assigned</span>
          )}
        </div>
      </li>
    ))
  ) : (
    <p>No notes available. Please add a note!</p>
  )}
</ul>

    </div>
  );
}

export default App;