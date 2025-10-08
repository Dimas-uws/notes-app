import { useEffect } from "react";
import { useState } from "react";

function App() {
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const baseUrl = "https://notes-app-api-rho.vercel.app";

  const fetchNotes = async (query = "") => {
    try {
      const url = query
        ? `${baseUrl}/notes?search=${encodeURIComponent(query)}`
        : `${baseUrl}/notes`;

      const res = await fetch(url);
      const result = await res.json();

      setNotes(result.data);
    } catch (error) {
      console.log("Error", error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const addNote = async (newTitle, newContent) => {
    try {
      const res = await fetch(`${baseUrl}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, content: newContent }),
      });

      const result = await res.json();

      if (res.ok) {
        setNotes([...notes, result.data]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateNote = async (id, updateTitle, updateContent) => {
    try {
      const res = await fetch(`${baseUrl}/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: updateTitle, content: updateContent }),
      });

      const result = await res.json();

      if (res.ok) {
        setNotes((prevNotes) =>
          prevNotes.map((note) => (note.id === id ? result.data : note))
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${baseUrl}/notes/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setNotes((notes) => notes.filter((note) => note.id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getNoteById = (id) => {
    console.log(id);
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    fetchNotes(query);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col mt-24 items-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-15 mt-5">
          Catatan Data Siswa Kodein 📒
        </h1>

        <input
          type="text"
          placeholder="Cari catatan..."
          value={searchQuery}
          onChange={handleSearch}
          className="mb-8 p-3 border border-gray-400 rounded-lg w-[90%] max-w-md"
        />

        <NoteForm onAddNote={addNote} />
        <NoteList
          notes={notes}
          onDelete={handleDelete}
          onUpdate={handleUpdateNote}
          onGetById={getNoteById}
        />
      </main>
    </>
  );
}

export default App;

// ================== Komponen ==================

const Navbar = () => {
  return (
    <nav className="w-full fixed top-0 flex justify-center shadow bg-gray-100">
      <div className="flex justify-between px-4 py-4 container ">
        <img src="/logoDU.svg" alt="Logo" className="w-10 h-auto" />
      </div>
    </nav>
  );
};

const NoteForm = ({ onAddNote }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddNote(title, content);
    setTitle("");
    setContent("");
  };

  return (
    <section className="container max-w-xl px-5 mb-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Title"
          className="rounded-sm outline outline-gray-400 p-3"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Content"
          className="resize-y min-h-14 rounded-sm outline outline-gray-400 p-3"
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white font-semibold rounded-lg py-3"
        >
          Add note
        </button>
      </form>
    </section>
  );
};

// ================== 🧩 NoteItem (FIX EDIT) ==================

const NoteItem = ({ note, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [titleEdit, setTitleEdit] = useState(note.title);
  const [contentEdit, setContentEdit] = useState(note.content);
  const [showDialog, setShowDialog] = useState(false);

  const handleCancelEdit = () => {
    setTitleEdit(note.title);
    setContentEdit(note.content);
    setIsEditing(false);
  };

  const handleDeleteConfirm = () => {
    setShowDialog(true);
  };

  const confirmDelete = () => {
    onDelete(note.id);
    setShowDialog(false);
  };

  const cancelDelete = () => {
    setShowDialog(false);
  };

  // 🟢 FIX: pastikan kirim data & refresh state
  const handleUpdateConfirm = async () => {
    await onUpdate(note.id, titleEdit, contentEdit);
    setIsEditing(false);
  };

  return (
    <>
      {/* ===== Popup Delete ===== */}
      {showDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 text-center w-80">
            <p className="text-gray-800 font-semibold mb-6">
              Yakin mau hapus catatan ini?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDelete}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Hapus
              </button>
              <button
                onClick={cancelDelete}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Popup Edit ===== */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 w-[90%] max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
              Edit Catatan
            </h2>
            <input
              value={titleEdit}
              type="text"
              className="w-full rounded-md border border-gray-400 p-3 mb-4"
              onChange={(e) => setTitleEdit(e.target.value)}
            />
            <textarea
              value={contentEdit}
              className="w-full rounded-md border border-gray-400 p-3 min-h-[120px]"
              onChange={(e) => setContentEdit(e.target.value)}
            />
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
                onClick={handleUpdateConfirm}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Card Catatan ===== */}
      <div className="rounded-lg shadow-md bg-white w-[300px] p-5">
        <p className="font-medium text-xl">{note.title}</p>
        <p className="text-sm text-gray-500">
          ~{showFormattedDate(note.created_at)}
        </p>
        <p className="mt-2">{note.content}</p>
        <div className="mt-4 flex gap-2">
          <button
            className="bg-yellow-500 text-white px-3 py-1 rounded cursor-pointer"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
          <button
            className="bg-red-500 text-white px-3 py-1 rounded cursor-pointer"
            onClick={handleDeleteConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </>
  );
};

// ================== NoteList ==================

const NoteList = ({ notes, onUpdate, onDelete }) => {
  return (
    <section className="container py-8">
      <h2 className="inline-flex items-center gap-2 text-2xl font-medium mb-6">
        <img src="/note.svg" alt="note icon" className="w-8 h-8" />
        Notes
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {notes.length > 0 ? (
          notes.map((note) => (
            <NoteItem
              key={note.id}
              note={note}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))
        ) : (
          <h1>Data Kosong</h1>
        )}
      </div>
    </section>
  );
};

// ================== Helper ==================

const showFormattedDate = (date) => {
  const options = {
    year: "numeric",
    month: "long",
    weekday: "long",
    day: "numeric",
  };
  return new Date(date).toLocaleDateString("id-ID", options);
};
