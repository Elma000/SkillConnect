import { Schema, ObjectId, model } from "mongoose";

const notepadSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, default: "" },
    owner: { type: ObjectId, ref: "users", required: true },
  },
  {
    timestamps: true,
  }
);

const Notepad = model("notepads", notepadSchema);
export default Notepad;

export const createNote = async ({ title, content, owner }) => {
  const note = new Notepad({ title, content, owner });
  return await note.save();
};

export const getNotesByOwner = async (ownerId) => {
  return await Notepad.find({ owner: ownerId }).sort({ updatedAt: -1 });
};

export const findNoteById = async (id) => {
  return await Notepad.findById(id);
};

export const updateNote = async (id, update) => {
  return await Notepad.findByIdAndUpdate(id, update, { new: true });
};

export const deleteNote = async (id) => {
  return await Notepad.findByIdAndDelete(id);
};
