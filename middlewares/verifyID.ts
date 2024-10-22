import { Request, Response, NextFunction } from 'express';
import { getSession } from '../service/auth';
import User from '../models/User';
import CustomRequest from '../types/customRequest';

const verifyId = async (req: CustomRequest, res: Response, next: NextFunction) => {
    // console.log("verifyId middleware : Authorization Header", req.headers.authorization);
    
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ success: false, message: "Unauthorized: No Authorization header found" });
        return;
    }
    
    const sessionId = authHeader.split(' ')[1];
    if (!sessionId) {
        res.status(401).json({ success: false, message: "Unauthorized: Invalid Authorization header" });
        return;
    }

    const userId = getSession(sessionId);
    if (!userId) {
        res.status(401).json({ success: false, message: "Unauthorized: Invalid Session ID" });
        return;
    }

    const user = await User.findById(userId);
    if (!user) {
        res.status(401).json({ success: false, message: "Unauthorized: User not found" });
        return;
    }

    req.user = { _id: userId, role: user.role };
    
    next();
}

export default verifyId;
