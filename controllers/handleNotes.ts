import { Request, Response } from 'express';
import Note from '../models/Note'; 

const getAllNotes = async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id || null;
        if (!userId) {
            res.status(401).json({ message: "You are not authorized to view the notes!" });
            return;
        }
        let notes;
        if (req.user?.role === "admin") {
            const targetUserId = req.query.id as string | undefined;
            if (!targetUserId) {
                notes = await Note.find();
            } else {
                notes = await Note.find({ user: targetUserId });
            }
        } else {
            notes = await Note.find({ user: userId });
        }
        if (!notes.length) {
            res.status(404).json({ message: "No notes found!" });
            return;
        }
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
}

const getNote = async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id || null;
        if (!userId) {
            res.status(401).json({ message: "You are not authorized to view the notes!" });
            return;
        }
        const note = await Note.findById(req.params.id);
        if (!note) {
            res.status(404).json({ message: "Note not found!" });
            return;
        }
        if (note.user.toString() !== req.user?._id.toString() && req.user?.role !== "admin") {
            res.status(401).json({ message: "You are not authorized to view this note!" });
            return;
        }
        res.status(200).json(note);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
}

const createNote = async (req: Request, res: Response) => {
    try {
        if (!req.body.title || !req.body.content) {
            res.status(400).json({ message: "Please provide title and content!" });
            return;
        }
        const note = await Note.create({ ...req.body, user: req.user?._id });
        res.status(201).json(note);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
}

const updateNote = async (req: Request, res: Response) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            res.status(404).json({ message: "Note not found!" });
            return;
        }
        if (note.user.toString() !== req.user?._id.toString() && req.user?.role !== "admin") {
            res.status(401).json({ message: "You are not authorized to update this note!" });
            return;
        }
        const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedNote);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
}

const deleteNote = async (req: Request, res: Response) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            res.status(404).json({ message: "Note not found!" });
            return;
        }
        if (note.user.toString() !== req.user?._id.toString() && req.user?.role !== "admin") {
            res.status(401).json({ message: "You are not authorized to delete this note!" });
            return;
        }
        await Note.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Note deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
}

export {
    getAllNotes,
    getNote,
    createNote,
    updateNote,
    deleteNote
};
