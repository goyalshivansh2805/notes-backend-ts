import { Request, Response } from 'express';
import User from '../../models/User';
import bcrypt from 'bcrypt';

const handleRegister = async (req: Request, res: Response): Promise<void> => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        res.status(400).json({success:false, message: "Please provide all fields!" });
        return;
    }
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({success:false, message: "User already exists!" });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hashedPassword });
        res.status(201).json({success:false, data:{id:user._id}, message: "User registered successfully!" });
    } catch (error) {
        res.status(500).json({ success:false,message: (error as Error).message });
    }
}

export default handleRegister;
