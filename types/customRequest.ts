import { Request } from "express";

interface CustomRequest extends Request {
    user?: {
        _id: string;
        role: string;
    };
}

export default CustomRequest;