import mongoose, { Schema, Types } from "mongoose";
import validator from "validator";
import { validateUserRole } from "./utils/validation.js";

const userSchema = new Schema(
    {
        name: {
            required: true,
            type: String,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            validate: [validator.isEmail, "Invalid email address"],
            lowercase: true,
            trim: true,
            unique: true,
            required: true,
        },
        role: {
            type: String,
            lowercase: true,
            trim: true,
            validate: [validateUserRole, "Invalid user role"],
            default: "standard",
        },
        createdBy: {
            type: Types.ObjectId,
            ref: "user",
            required: true,
        },
        updatedBy: {
            type: Types.ObjectId,
            ref: "user",
            required: true,
        },
        changes: {
            type: Array,
            requird: true,
            default: [
                {
                    activity: "Created",
                    timestamp: new Date(),
                },
            ],
        },
    },
    { timestamps: true }
);
export const UserModel = mongoose.model("user", userSchema);
