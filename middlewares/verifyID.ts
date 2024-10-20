import { Request, Response, NextFunction } from 'express';
import { getSession } from '../service/auth';
import User from '../models/User';
import CustomRequest from '../types/customRequest';

const verifyId = async (req: CustomRequest, res: Response, next: NextFunction) => {
    console.log("verifyId middleware : ", req.cookies);
    const sessionId = req.cookies?.sessionId;
    if (!sessionId) {
        res.status(401).json({success:false, message: "Unauthorized: No Session ID found" });
        return;
    }

    const userId = getSession(sessionId);
    if (!userId){
        res.status(401).json({success:false, message: "Unauthorized: Invalid Session ID" });
        return;
    }

    const user = await User.findById(userId);
    if (!user) {
        res.status(401).json({success:false, message: "Unauthorized: User not found" });
        return;
    }

    req.user = { _id: userId, role: user.role };
    next();
}

export default verifyId;
