import { NextFunction, Request, Response } from 'express';
import User from '../../models/User';
import bcrypt from 'bcrypt';
import { CustomError } from '../../types/express';

const handleRegister = async (req: Request, res: Response,next:NextFunction): Promise<void> => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        const error:CustomError = new Error("Please provide all fields!");
        error.statusCode = 400;
        throw error;
    }
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const error:CustomError = new Error("User already exists!");
            error.statusCode = 400;
            throw error;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hashedPassword });
        res.status(201).json({success:false, data:{id:user._id}, message: "User registered successfully!" });
    } catch (error) {
        next(error);
    }
}

export default handleRegister;
