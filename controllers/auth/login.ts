import { Request, Response ,NextFunction} from 'express';
import bcrypt from 'bcrypt';
import {User} from "../../models"
import { v4 as uuidv4 } from 'uuid';
import { createSession, getSession, deleteSession } from '../../service';
import {CustomError} from "../../types";

const handleLogin = async (req: Request, res: Response,next:NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new CustomError("Please provide all fields!", 400);
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            throw new CustomError("User does not exists!",404);
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch){
            throw new CustomError("Invalid credentials!",401);
        }

        const existingSessionId = req.cookies?.sessionId;
        if (existingSessionId) {
            const existingSession = getSession(existingSessionId);
            if (existingSession) {
                deleteSession(existingSessionId);
            }
        }

        const sessionId = uuidv4();
        createSession(sessionId, user._id as string);
        res.cookie("sessionId", sessionId, { httpOnly: true });

        res.status(200).json({success:true, data:{id:user._id,sessionId}, message: "User logged in successfully!" });
    } catch (error) {
        next(error);
    }
}

export default handleLogin;
