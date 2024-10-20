import express from 'express';
import promoteController from '../controllers/auth/promote';

const router = express.Router();

router.post('/', promoteController);

export default router;
