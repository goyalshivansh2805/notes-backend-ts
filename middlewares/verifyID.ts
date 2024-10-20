import { Request, Response, NextFunction } from 'express';
import { getSession } from '../service/auth';
import User from '../models/User';

const verifyId = async (req: Request, res: Response, next: NextFunction) => {
    const sessionId = req.cookies?.sessionId;
    if (!sessionId) {
        res.status(401).json({ message: "Unauthorized: No Session ID found" });
        return;
    }

    const userId = getSession(sessionId);
    if (!userId){
        res.status(401).json({ message: "Unauthorized: Invalid Session ID" });
        return;
    }

    const user = await User.findById(userId);
    if (!user) {
        res.status(401).json({ message: "Unauthorized: User not found" });
        return;
    }

    req.user = { _id: userId, role: user.role };
    next();
}

export default verifyId;
