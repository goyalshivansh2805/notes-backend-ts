import { NextFunction, Request, Response } from 'express';
import User from '../../models/User'; 
import { CustomError } from '../../types/express';
import { nextTick } from 'process';

const handlePromote = async (req: Request, res: Response,next:NextFunction) => {
    const userId = req.user?._id || null;
    if (!userId || !req.user || req.user.role !== "admin") {
        const error:CustomError = new Error("You are not authorized to promote a user!");
        error.statusCode = 401;
        throw error;
    }
    const { email } = req.body;
    if (!email) {
        const error:CustomError = new Error("Please provide email!");
        error.statusCode = 400;
        throw error;
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            const error:CustomError = new Error("User not found!");
            error.statusCode = 404;
            throw error;
        }
        user.role = "admin";
        await user.save();
        res.status(200).json({success:true, message: "User promoted successfully!" });
    } catch (error) {
        next(error);
    }
}

export default handlePromote;
