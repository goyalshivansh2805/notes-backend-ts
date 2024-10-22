import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../uploads');
        if(!fs.existsSync(uploadPath)){
            fs.mkdirSync(uploadPath);
        }
        cb(null, './uploads'); 
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueSuffix); 
    }
});


const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 },
});

export default upload;