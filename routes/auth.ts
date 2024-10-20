import express from 'express';
import registerController from '../controllers/auth/register';
import loginController from '../controllers/auth/login';

const router = express.Router();

router.post('/register', registerController);
router.post('/login', loginController);

export default router;
