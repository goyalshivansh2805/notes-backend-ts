import mongoose from 'mongoose';

const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
    } catch (error) {
        console.log(error);
    }
}

export default connectToDB;
