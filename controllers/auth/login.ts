import { Request, Response ,NextFunction} from 'express';
import bcrypt from 'bcrypt';
import User from '../../models/User';
import { v4 as uuidv4 } from 'uuid';
import { createSession, getSession, deleteSession } from '../../service/auth';
import { CustomError } from '../../types/express';

const handleLogin = async (req: Request, res: Response,next:NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
        const error:CustomError = new Error("Please provide email and password!");
        error.statusCode = 400;
        throw error;
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            const error:CustomError = new Error("User does not exist");
            error.statusCode = 404;
            throw error;
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch){
            const error:CustomError = new Error("Invalid credentials");
            error.statusCode = 400;
            throw error;
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

        res.status(200).json({success:true, data:{id:user._id}, message: "User logged in successfully!" });
    } catch (error) {
        next(error);
    }
}

export default handleLogin;
