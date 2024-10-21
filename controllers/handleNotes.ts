import { NextFunction, Request, Response } from 'express';
import {Note} from "../models"
import {CustomError , CustomRequest} from '../types';

const getAllNotes = async (req: CustomRequest, res: Response,next:NextFunction) => {
    try {
        const userId = req.user?._id || null;
        if (!userId) {
            throw new CustomError("You are not authorized to view the notes!", 401);
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
            throw new CustomError("No notes found!",404);
        }
        res.status(200).json({success:true, data:{notes}});
    } catch (error) {
        next(error);
    }
}

const getNote = async (req: CustomRequest, res: Response,next:NextFunction) => {
    try {
        const userId = req.user?._id || null;
        if (!userId) {
            throw new CustomError("You are not authorized to view the note!", 401);
        }
        const note = await Note.findById(req.params.id);
        if (!note) {
            throw new CustomError("Note not found!",404);
        }
        if (note.user.toString() !== req.user?._id.toString() && req.user?.role !== "admin") {
            throw new CustomError("You are not authorized to view this note!",401);
        }
        res.status(200).json({success:true, data:{note}});
    } catch (error) {
        next(error);
    }
}

const createNote = async (req: CustomRequest, res: Response,next:NextFunction) => {
    try {
        if (!req.body.title || !req.body.content) {
            throw new CustomError("Please provide title and content of the note!", 400);
        }
        const note = await Note.create({ ...req.body, user: req.user?._id });
        res.status(201).json({success:true, data:{note}});
    } catch (error) {
       next(error);
    }
}

const updateNote = async (req: CustomRequest, res: Response,next:NextFunction) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            throw new CustomError("Note not found!",404);
        }
        if (note.user.toString() !== req.user?._id.toString() && req.user?.role !== "admin") {
            throw new CustomError("You are not authorized to update this note!",401);
        }
        const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({success:true, data:{note:updatedNote}});
    } catch (error) {
        next(error);
    }
}

const deleteNote = async (req: CustomRequest, res: Response,next:NextFunction) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            throw new CustomError("Note not found!",404);
        }
        if (note.user.toString() !== req.user?._id.toString() && req.user?.role !== "admin") {
            throw new CustomError("You are not authorized to delete this note!",401);
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
