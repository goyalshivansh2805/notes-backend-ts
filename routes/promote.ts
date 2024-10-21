import express from 'express';
import {handlePromote} from '../controllers';

const router = express.Router();

router.post('/', handlePromote);

export default router;
