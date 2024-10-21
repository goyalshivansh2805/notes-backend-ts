import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { CustomError } from '../types/express';
const errorHandler = (error: CustomError, req: Request, res: Response, next: NextFunction) => { 
    const statusCode = error.statusCode || 500; 
    const message = error.message || 'Internal Server Error';
    const log = `${statusCode} ${message} ${new Date().toISOString()} ${req.ip} ${req.method} ${req.url}\n`;
    const logsDir = path.join(__dirname, '../logs');
    const logFilePath = path.join(logsDir, 'errors.txt');
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true }); 
    }
    if (!fs.existsSync(logFilePath)){
        fs.writeFileSync(logFilePath,"");
    }
    fs.appendFile(logFilePath, log, (err) => {
        if (err) {
            console.log(err);
        }
    });

    res.status(statusCode).json({
        success: false,
        error: message,
    });
};

export default errorHandler;
