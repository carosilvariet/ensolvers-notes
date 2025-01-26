import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NoteList = ({ refresh }) => {
  const [notes, setNotes] = useState([]);

  const fetchNotes = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/notes');
      console.log("Notes from API:", response.data);
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [refresh]); 

  return (
    <div>
      <h2>Notes</h2>
      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            <strong>{note.title}</strong> - {note.content} <br />
            <span>{note.archived ? 'Archived' : 'Active'}</span> <br />
            <span>
              Category: {note.category?.name || "No category assigned"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NoteList;