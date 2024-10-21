import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import {connectToDB} from './config';
import {logRequest , verifyID ,errorHandler} from './middlewares';
import cookieParser from 'cookie-parser';
import {authRoute,promoteRoute,notesRoute} from './routes';
import {CustomError} from './types';

dotenv.config();

const app = express();
const PORT: number = Number(process.env.PORT) || 5000;

connectToDB();

app.use(cors({
    origin:"*",
    credentials: true, 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(logRequest);

app.use('/api/auth', authRoute);
app.use('/api/notes', verifyID, notesRoute);
app.use('/api/promote', verifyID, promoteRoute);

app.use('*', (req: Request, res: Response,next:NextFunction) => {
    const error = new CustomError('Resource not found!', 404);
    next(error);
});

app.use(errorHandler);

mongoose.connection.on('open', () => {
    console.log('Connected to Database...');
    app.listen(PORT, () => {
        console.log(`Server is listening on PORT ${PORT}`);
    });
});
