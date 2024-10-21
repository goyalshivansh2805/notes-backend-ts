import express from 'express';
import registerController from '../controllers/auth/register';
import loginController from '../controllers/auth/login';
import validateRegister from '../middlewares/validateRegister';
import validateLogin from '../middlewares/validateLogin';

const router = express.Router();

router.post('/register',validateRegister,registerController);
router.post('/login',validateLogin, loginController);

export default router;
