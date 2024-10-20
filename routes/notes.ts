import express from 'express';
import * as notesController from '../controllers/handleNotes';

const router = express.Router();

router.route('/')
    .get(notesController.getAllNotes)
    .post(notesController.createNote);

router.route('/:id')
    .get(notesController.getNote)
    .put(notesController.updateNote)
    .delete(notesController.deleteNote);

export default router;
