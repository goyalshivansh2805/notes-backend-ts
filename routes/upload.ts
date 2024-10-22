import { Router } from 'express';
import { uploadSingleFile } from '../controllers';
import { upload } from '../config';

const router = Router();

router.post('/', upload.single('file'), uploadSingleFile);

export default router;
