import mongoose from "mongoose";

export default async () => {
    try {
        await mongoose.connect(process.env.CONN_STRING);

        console.log("MongoDB Successfully Connected!");
    } catch (err) {
        console.error("Error connecting to MongoDB: ", err);
        process.exit(1);
    }
};
