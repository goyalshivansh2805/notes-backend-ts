import { Request, Response } from 'express';

const uploadSingleFile = (req: Request, res: Response) => {
    if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
    }
    res.json({success:true, message: 'File uploaded successfully!',data:{ file: req.file }});
};

export default uploadSingleFile;