import { NextFunction, Request, Response } from 'express';
import {User} from "../../models"
import bcrypt from 'bcrypt';
import {CustomError} from '../../types';

const handleRegister = async (req: Request, res: Response,next:NextFunction): Promise<void> => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        throw new CustomError("Please provide all fields!", 400);
    }
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new CustomError("User already exists!",400);
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hashedPassword });
        res.status(201).json({success:false, data:{id:user._id}, message: "User registered successfully!" });
    } catch (error) {
        next(error);
    }
}

export default handleRegister;
