import { Request } from 'express';

declare global {
    namespace Express {
        interface Request {
            user?: {
                _id: string;
                role: string;
            };
        }
    }
}

interface CustomError extends Error {
    statusCode?: number;
}
