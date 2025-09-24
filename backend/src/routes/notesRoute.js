import express from "express"
import { addNoteHandler, getAllNotesHandler, getNoteByIdHandler } from "../handlers/notesHandler.js"


const noteRoute = express.Router()

noteRoute.get("/notes", getAllNotesHandler)
noteRoute.post("/notes", addNoteHandler)
noteRoute.get("/notes/:id", getNoteByIdHandler)

export default noteRoute