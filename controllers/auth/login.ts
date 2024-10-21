import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../../models/User';
import { v4 as uuidv4 } from 'uuid';
import { createSession, getSession, deleteSession } from '../../service/auth';

const handleLogin = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ success:false, message: "Please provide email and password!" });
        return;
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({success:false, message: "User does not exist" });
            return;
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch){
            res.status(400).json({ success:false,message: "Invalid credentials" });
            return;
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
        res.status(500).json({ success:false, message: (error as Error).message });
    }
}

export default handleLogin;
