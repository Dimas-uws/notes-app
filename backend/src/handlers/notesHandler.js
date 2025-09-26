import { pool } from "../config/db.js";

// Mendapatkan semua catatan
export const getAllNotesHandler = async (req, res) => {
  const [notes] = await pool.query("SELECT * FROM notes");

  res.status(200).json({
    status: "success",
    data: notes,
  });
};

// Mambuat catatan baru
export const addNoteHandler = async (req, res) => {
  const { title, content } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({
      status: "fail",
      massage: "title kosong",
    });
  }

  if (!content || !content.trim()) {
    return res.status(400).json({
      status: "fail",
      massage: "content kosong",
    });
  }

  // Menyimpan catatan ke database
  const [insertResult] = await pool.query(
    "INSERT INTO notes (title, content) VALUES (?, ?)",
    [title, content]
  );

  const [notes] = await pool.query(
    "SELECT * FROM notes WHERE id = ?", [insertResult.insertId]
  );

  res.status(201).json({
    status: "success",
    message: "Note created",
    data: notes[0],
  });
};

// Mendapatkan catatan berdasarkan ID
export const getNoteByIdHandler = async (req, res) => {
  const { id } = req.params;

  const [notes] = await pool.query("SELECT * FROM notes WHERE id = ?", [id]);

  if (notes.length === 0) {
    return res.status(404).json({
      status: "fail",
      massage: "tidak ditemukan",
    });
  }

  res.status(200).json({
    status: "success",
    data: notes[0],
  });
};

//update
export const updateNotesByIdHandler = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({
      status: "fail",
      massage: "title kosong",
    });
  }

  if (!content || !content.trim()) {
    return res.status(400).json({
      status: "fail",
      massage: "content kosong",
    });
  }

  await pool.query("UPDATE notes SET title=?, content=? WHERE id=?", [
    title,
    content,
    id,
  ]);

  const [notes] = await pool.query("SELECT * FROM notes WHERE id = ?", [id]);

  if (notes.length === 0) {
    return res.status(404).json({
      status: "fail",
      massage: "tidak ditemukan",
    });
  }

  res.status(200).json({
    status: "succes",
    massage: "note berhasil di update",
    data: notes[0],
  });
};

//delete
export const deleteNoteByIdHandler = async (req, res) => {
  const { id } = req.params;

  const [deleteNote] = await pool.query("DELETE FROM notes WHERE id = ?", [id])

  if (deleteNote.affectedRows === 0) {
    return res.status(404).json({
      status: "fail",
      massage: "tidak ditemukan",
    });
  }

  res.status(200).json({
    status: "succes",
    massage: "note berhasil di hapus"
  })

}
