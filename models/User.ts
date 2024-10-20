import { Schema, model, Document } from "mongoose";

interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    role: string;
}

const userSchema = new Schema<IUser>({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "user"
    }
}, { timestamps: true });

export default model<IUser>("User", userSchema);
