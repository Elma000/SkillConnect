import express from "express";
import {
  createNote,
  getNotesByOwner,
  findNoteById,
  updateNote,
  deleteNote,
} from "../service/notepad.service.js";

const notepadRoute = express.Router();

// create a note for the logged-in user
notepadRoute.post("/create", async (req, res) => {
  if (!req.userId) return res.status(401).send("Unauthorized");
  const { title, content } = req.body;
  if (!title) return res.status(400).send("Title is required");
  try {
    const note = await createNote({ title, content: content || "", owner: req.userId });
    res.status(201).send(note);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// list notes for logged-in user
notepadRoute.get("/entries", async (req, res) => {
  if (!req.userId) return res.status(401).send("Unauthorized");
  try {
    const notes = await getNotesByOwner(req.userId);
    res.status(200).send(notes);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

notepadRoute.get("/:id", async (req, res) => {
  if (!req.userId) return res.status(401).send("Unauthorized");
  try {
    const note = await findNoteById(req.params.id);
    if (!note) return res.status(404).send("Note not found");
    if (note.owner.toString() !== req.userId) return res.status(403).send("Forbidden");
    res.status(200).send(note);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

notepadRoute.put("/update/:id", async (req, res) => {
  if (!req.userId) return res.status(401).send("Unauthorized");
  try {
    const note = await findNoteById(req.params.id);
    if (!note) return res.status(404).send("Note not found");
    if (note.owner.toString() !== req.userId) return res.status(403).send("Forbidden");
    const update = {};
    if (req.body.title !== undefined) update.title = req.body.title;
    if (req.body.content !== undefined) update.content = req.body.content;
    const updated = await updateNote(req.params.id, update);
    res.status(200).send(updated);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

notepadRoute.delete("/delete/:id", async (req, res) => {
  if (!req.userId) return res.status(401).send("Unauthorized");
  try {
    const note = await findNoteById(req.params.id);
    if (!note) return res.status(404).send("Note not found");
    if (note.owner.toString() !== req.userId) return res.status(403).send("Forbidden");
    await deleteNote(req.params.id);
    res.status(200).send({ message: "Note deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

export default notepadRoute;
