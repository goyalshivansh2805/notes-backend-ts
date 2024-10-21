import { NextFunction, Request, Response } from 'express';
import {User} from "../../models"
import {CustomError , CustomRequest} from '../../types';

const handlePromote = async (req: CustomRequest, res: Response,next:NextFunction) => {
    const userId = req.user?._id || null;
    if (!userId || !req.user || req.user.role !== "admin") {
        throw new CustomError("You are not authorized to promote a user!", 401);
    }
    const { email } = req.body;
    if (!email) {
        throw new CustomError("Please provide email of the user to promote!",400);
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            throw new CustomError("User not found!",404);
        }
        user.role = "admin";
        await user.save();
        res.status(200).json({success:true, message: "User promoted successfully!" });
    } catch (error) {
        next(error);
    }
}

export default handlePromote;
