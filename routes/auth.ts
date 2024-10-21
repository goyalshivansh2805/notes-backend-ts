import express from 'express';
import { handleRegister, handleLogin } from '../controllers';
import {validateRegister, validateLogin} from '../middlewares';

const router = express.Router();

router.post('/register',validateRegister,handleRegister);
router.post('/login',validateLogin, handleLogin);

export default router;
