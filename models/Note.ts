import { Schema, model, Document } from "mongoose";

interface INote extends Document {
    title: string;
    content: string;
    user: Schema.Types.ObjectId;
}

const noteSchema = new Schema<INote>({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

export default model<INote>("Note", noteSchema);
