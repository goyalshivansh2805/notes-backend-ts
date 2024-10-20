import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import connectToDB from './config/connection';
import logRequest from './middlewares/logRequests';
import cookieParser from 'cookie-parser';
import verifyId from './middlewares/verifyID';
import authRoute from './routes/auth';
import notesRoute from './routes/notes';
import promoteRoute from './routes/promote';

dotenv.config();

const app = express();
const PORT: number = Number(process.env.PORT) || 5000;

connectToDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(logRequest);

app.use('/api/auth', authRoute);
app.use('/api/notes', verifyId, notesRoute);
app.use('/api/promote', verifyId, promoteRoute);

app.use('*', (req: Request, res: Response) => {
    res.status(404).json({ message: 'EndPoint not found!' });
});

mongoose.connection.on('open', () => {
    console.log('Connected to Database...');
    app.listen(PORT, () => {
        console.log(`Server is listening on PORT ${PORT}`);
    });
});
