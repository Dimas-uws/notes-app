import express from "express"
import { addNoteHandler, deleteNoteByIdHandler, getAllNotesHandler, getNoteByIdHandler, updateNotesByIdHandler } from "../handlers/notesHandler.js"


const noteRoute = express.Router()

noteRoute.get("/notes", getAllNotesHandler)
noteRoute.post("/notes", addNoteHandler)
noteRoute.get("/notes/:id", getNoteByIdHandler)
noteRoute.put("/notes/:id", updateNotesByIdHandler)
noteRoute.delete("/notes/:id", deleteNoteByIdHandler)

export default noteRoute