import { NextFunction, Request, Response } from 'express';
import Note from '../models/Note'; 
import { CustomError } from '../types/express';

const getAllNotes = async (req: Request, res: Response,next:NextFunction) => {
    try {
        const userId = req.user?._id || null;
        if (!userId) {
            const error:CustomError = new Error("You are not authorized to view the notes!");
            error.statusCode = 401;
            throw error;
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
            const error:CustomError = new Error("No notes found!");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({success:true, data:{notes}});
    } catch (error) {
        next(error);
    }
}

const getNote = async (req: Request, res: Response,next:NextFunction) => {
    try {
        const userId = req.user?._id || null;
        if (!userId) {
            const error:CustomError = new Error("You are not authorized to view the notes!");
            error.statusCode = 401;
            throw error;
        }
        const note = await Note.findById(req.params.id);
        if (!note) {
            const error:CustomError = new Error("Note not found!");
            error.statusCode = 404;
            throw error;
        }
        if (note.user.toString() !== req.user?._id.toString() && req.user?.role !== "admin") {
            const error:CustomError = new Error("You are not authorized to view this note!");
            error.statusCode = 401;
            throw error;
        }
        res.status(200).json({success:true, data:{note}});
    } catch (error) {
        next(error);
    }
}

const createNote = async (req: Request, res: Response,next:NextFunction) => {
    try {
        if (!req.body.title || !req.body.content) {
            const error:CustomError = new Error("Please provide title and content!");
            error.statusCode = 400;
            throw error;
        }
        const note = await Note.create({ ...req.body, user: req.user?._id });
        res.status(201).json({success:true, data:{note}});
    } catch (error) {
       next(error);
    }
}

const updateNote = async (req: Request, res: Response,next:NextFunction) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            const error:CustomError = new Error("Note not found!");
            error.statusCode = 404;
            throw error;
        }
        if (note.user.toString() !== req.user?._id.toString() && req.user?.role !== "admin") {
            const error:CustomError = new Error("You are not authorized to update this note!");
            error.statusCode = 401;
            throw error;
        }
        const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({success:true, data:{note:updatedNote}});
    } catch (error) {
        next(error);
    }
}

const deleteNote = async (req: Request, res: Response,next:NextFunction) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            const error:CustomError = new Error("Note not found!");
            error.statusCode = 404;
            throw error;
        }
        if (note.user.toString() !== req.user?._id.toString() && req.user?.role !== "admin") {
            const error:CustomError = new Error("You are not authorized to delete this note!");
            error.statusCode = 401;
            throw error;
        }
        await Note.findByIdAndDelete(req.params.id);
        res.status(200).json({success:true, message: "Note deleted successfully!" });
    } catch (error) {
        next(error);
    }
}

export {
    getAllNotes,
    getNote,
    createNote,
    updateNote,
    deleteNote
};
