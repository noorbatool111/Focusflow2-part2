'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NotesPage() {
  const router = useRouter();
  const [noteInput, setNoteInput] = useState('');
  const [notes, setNotes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) router.push('/login');
    fetchNotes();
  }, [router]);

  const fetchNotes = async () => {
    const res = await fetch('/api/notes');
    const data = await res.json();
    setNotes(data);
  };

  const addNote = async () => {
    if (!noteInput.trim()) return alert('Note cannot be empty');
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: noteInput }),
    });
    const newNote = await res.json();
    setNotes([newNote, ...notes]);
    setNoteInput('');
  };

  const deleteNote = async (id) => {
    await fetch(`/api/notes/${id}`, { method: 'DELETE' });
    setNotes(notes.filter((n) => n._id !== id));
  };

  const startEdit = (id, currentContent) => {
    setEditingId(id);
    setEditContent(currentContent);
  };

  const updateNote = async () => {
    const res = await fetch(`/api/notes/${editingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: editContent }),
    });
    const updated = await res.json();
    setNotes(notes.map((n) => (n._id === editingId ? updated : n)));
    setEditingId(null);
    setEditContent('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-300 via-pink-100 to-purple-300 text-gray-900">
      <header className="fixed top-0 left-0 w-full bg-white shadow-md z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <h2 className="text-2xl font-bold text-pink-500">📝 Notes</h2>
          <a href="/dashboard" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
            Back to Dashboard
          </a>
        </div>
      </header>

      <main className="max-w-2xl mx-auto pt-32 pb-12 px-4">
        <h3 className="text-3xl font-bold text-purple-700 text-center mb-6">Your Notes</h3>

        <div className="flex flex-col gap-4 mb-8">
          <textarea
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            placeholder="Write your note here..."
            className="w-full p-3 border-2 border-dashed border-pink-400 rounded-xl bg-pink-100 text-base resize-y h-32"
          />
          <button
            onClick={addNote}
            className="self-start bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-lg"
          >
            Add Note
          </button>
        </div>

        {notes.length > 0 ? (
          <div className="flex flex-col gap-4">
            {notes.map((note) => (
              <div key={note._id} className="bg-white p-4 rounded-xl shadow-md">
                {editingId === note._id ? (
                  <>
                    <textarea
                      className="w-full border rounded-md p-2"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        onClick={updateNote}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between items-start gap-4">
                    <p className="text-base w-full break-words">{note.content}</p>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => startEdit(note._id, note.content)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded-md text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteNote(note._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md text-sm"
                      >
                        X
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 italic mt-8">🩷 No notes yet. Start writing your thoughts!</p>
        )}
      </main>
    </div>
  );
}