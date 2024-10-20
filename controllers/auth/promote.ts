import { Request, Response } from 'express';
import User from '../../models/User'; 

const handlePromote = async (req: Request, res: Response) => {
    const userId = req.user?._id || null;
    if (!userId || !req.user || req.user.role !== "admin") {
        res.status(401).json({ message: "You are not authorized to promote a user!" });
        return;
    }
    const { email } = req.body;
    if (!email) {
        res.status(400).json({ message: "Please provide email!" });
        return;
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({ message: "User does not exist" });
            return
        }
        user.role = "admin";
        await user.save();
        res.status(200).json({ message: "User promoted successfully!" });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
}

export default handlePromote;
